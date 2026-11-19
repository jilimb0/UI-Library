#!/usr/bin/env node
// ci-publish.mjs
//
// Why this script exists instead of `pnpm -r publish`:
//   pnpm does NOT rewrite workspace:* / workspace:^ refs before publishing.
//   workspace:* left in published package.json makes packages uninstallable.
//
// This script:
//   1. For each publishable package, temporarily rewrites workspace:* -> ^semver
//      and catalog: -> version range from pnpm-workspace.yaml
//   2. Checks if the version is already published (idempotent)
//   3. Publishes via `npm publish --provenance` (OIDC Trusted Publisher auth)
//   4. Confirms the version appears on the registry (retry x5, 10s backoff)
//   5. Restores the original package.json
//
// Auth: setup-node writes //registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
// into ~/.npmrc. With id-token:write + --provenance, npm exchanges the GitHub
// OIDC token automatically. NODE_AUTH_TOKEN is set to GITHUB_TOKEN in the
// workflow — this satisfies npm's auth lookup even though the actual OIDC
// exchange is done transparently by npm via the Actions token env vars.

import { execSync } from 'node:child_process';
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');
const LOG_FILE = `/tmp/ci-publish-${Date.now()}.log`;

function log(msg) {
  const line = `[ci-publish] ${msg}`;
  console.log(line);
  try { writeFileSync(LOG_FILE, line + '\n', { flag: 'a' }); } catch {}
}

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}

function writeJson(p, obj) {
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf-8');
}

function getPublishablePackages() {
  const results = [];
  const pkgsDir = resolve(root, 'packages');
  for (const entry of readdirSync(pkgsDir)) {
    const pkgPath = resolve(pkgsDir, entry, 'package.json');
    try {
      const pkg = readJson(pkgPath);
      if (!pkg.private && pkg.name && pkg.version) {
        results.push({ path: pkgPath, dir: resolve(pkgsDir, entry), pkg });
      }
    } catch {}
    const sub = resolve(pkgsDir, entry);
    if (statSync(sub).isDirectory()) {
      for (const sub2 of readdirSync(sub)) {
        const p2 = resolve(sub, sub2, 'package.json');
        try {
          const pkg = readJson(p2);
          if (!pkg.private && pkg.name && pkg.version) {
            results.push({ path: p2, dir: resolve(sub, sub2), pkg });
          }
        } catch {}
      }
    }
  }
  return results;
}

function buildWorkspaceVersionMap(packages) {
  const map = {};
  for (const { pkg } of packages) map[pkg.name] = pkg.version;
  return map;
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseCatalogFromWorkspaceYaml(yamlText) {
  const catalog = {};
  let inCatalog = false;

  for (const line of yamlText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    if (!inCatalog) {
      if (/^catalog:\s*(?:#.*)?$/.test(trimmed)) {
        inCatalog = true;
      }
      continue;
    }

    if (!/^\s/.test(line)) {
      break;
    }

    const match = line.match(/^\s+(['"][^'"]+['"]|[^:\s][^:]*)\s*:\s*(.*)$/);
    if (!match) {
      continue;
    }

    const dep = stripQuotes(match[1]);
    const rawVal = match[2].trim();
    const quotedMatch = rawVal.match(/^(['"])(.*?)\1/);
    const ver = quotedMatch
      ? quotedMatch[2]
      : rawVal.replace(/\s+#.*$/, '').trim();

    if (dep && ver) {
      catalog[dep] = ver;
    }
  }

  return catalog;
}

export function loadCatalogMap(repoRoot = root) {
  const wsPath = resolve(repoRoot, 'pnpm-workspace.yaml');
  if (!existsSync(wsPath)) {
    return {};
  }
  return parseCatalogFromWorkspaceYaml(readFileSync(wsPath, 'utf-8'));
}

export function rewritePublishDeps(pkgObj, versionMap, catalogMap = {}) {
  const fields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];
  const original = {};
  let changed = false;

  for (const field of fields) {
    if (!pkgObj[field]) continue;
    original[field] = {};
    for (const [dep, ver] of Object.entries(pkgObj[field])) {
      original[field][dep] = ver;
      if (typeof ver !== 'string') continue;

      if (ver.startsWith('workspace:')) {
        const resolved = versionMap[dep];
        if (resolved) {
          pkgObj[field][dep] = `^${resolved}`;
          changed = true;
        }
      } else if (ver === 'catalog:') {
        const resolved = catalogMap[dep];
        if (resolved) {
          pkgObj[field][dep] = resolved;
          changed = true;
        } else if (field !== 'devDependencies') {
          throw new Error(
            `Missing catalog version for ${dep} in ${pkgObj.name || 'package'} (${field})`
          );
        }
      }
    }
  }
  return { changed, original };
}

export function restorePublishDeps(pkgObj, original) {
  for (const [field, deps] of Object.entries(original)) {
    if (!pkgObj[field]) continue;
    for (const [dep, ver] of Object.entries(deps)) {
      pkgObj[field][dep] = ver;
    }
  }
}

function isAlreadyPublished(name, version) {
  // Check via the public npm registry API — doesn't need auth for public packages.
  // Uses cache-busting timestamp & Cache-Control: no-cache to avoid stale edge CDN 404s.
  try {
    const url = `https://registry.npmjs.org/${name.replaceAll('/', '%2f')}/${version}?t=${Date.now()}`;
    const result = execSync(
      `curl -sf -H "Cache-Control: no-cache" "${url}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 10000 }
    ).trim();
    return result.length > 0;
  } catch {
    return false;
  }
}

function confirmPublished(name, version) {
  const maxAttempts = 12; // 12 * 10s = 2 minutes total backoff
  for (let i = 1; i <= maxAttempts; i++) {
    if (isAlreadyPublished(name, version)) {
      log(`✅ confirmed on registry: ${name}@${version}`);
      return;
    }
    if (i < maxAttempts) {
      log(`  registry not yet showing ${name}@${version} — waiting 10s (attempt ${i}/${maxAttempts})`);
      execSync('sleep 10');
    }
  }
  // npm publish returned code 0 (accepted by registry), so do not fail CI if edge CDN replication lags
  log(`  ⚠️  warning: ${name}@${version} was published by npm, but registry CDN hasn't updated within ${maxAttempts * 10}s`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const packages = getPublishablePackages();
  const versionMap = buildWorkspaceVersionMap(packages);
  const catalogMap = loadCatalogMap(root);
  const provenanceFlag =
    process.env.NPM_PUBLISH_PROVENANCE === 'true' ? '--provenance' : '';

  log(`publishing ${packages.length} package(s)`);
  if (provenanceFlag) log('OIDC provenance enabled');

  const errors = [];

  for (const { path: pkgPath, dir, pkg } of packages) {
    const { name, version } = pkg;
    log(`\n── ${name}@${version} ──`);

    if (isAlreadyPublished(name, version)) {
      log('  already published — skipping');
      continue;
    }

    const pkgObj = readJson(pkgPath);
    const { changed, original } = rewritePublishDeps(
      pkgObj,
      versionMap,
      catalogMap
    );
    if (changed) {
      log('  rewriting workspace:* and catalog: deps -> semver');
      writeJson(pkgPath, pkgObj);
    }

    try {
      const cmd = `npm publish --access public ${provenanceFlag}`.trim();
      log(`  $ ${cmd}`);
      const out = execSync(cmd, {
        cwd: dir,
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf-8',
      });
      log(out.trim());
      confirmPublished(name, version);
    } catch (err) {
      const detail = [err.stderr, err.stdout]
        .filter(Boolean)
        .map((s) => s.trim())
        .join('\n');
      const msg = detail || err.message;
      log(`  ❌ FAILED: ${msg}`);
      errors.push({ name, version, error: msg });
    } finally {
      if (changed) {
        const restored = readJson(pkgPath);
        restorePublishDeps(restored, original);
        writeJson(pkgPath, restored);
        log('  restored workspace:* and catalog: refs');
      }
    }
  }

  if (errors.length > 0) {
    log(`\n❌ ${errors.length} package(s) failed:`);
    for (const e of errors) log(`  ${e.name}@${e.version}: ${e.error}`);
    process.exit(1);
  }

  log('\n✅ all packages published successfully');
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main();
}
