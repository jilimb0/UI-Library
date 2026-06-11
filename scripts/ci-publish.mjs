#!/usr/bin/env node
// ci-publish.mjs
// Called by changesets/action `publish:` command.
//
// Why this script exists instead of `pnpm -r publish`:
//   pnpm does NOT rewrite workspace:* / workspace:^ refs before publishing.
//   If a package has `"@ui-construction-library/tokens": "workspace:*"` in
//   its dependencies, that literal string ends up in the published package.json,
//   making the package uninstallable for external consumers.
//
// This script:
//   1. For each publishable package, temporarily rewrites workspace:* → ^semver
//   2. Checks if the version is already published (idempotent — safe to retry)
//   3. Publishes via `npm publish` with --provenance if NPM_PUBLISH_PROVENANCE=true
//   4. Confirms the version appears on the registry (retry x5, 10 s backoff)
//   5. Restores the original package.json content

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const LOG_FILE = `/tmp/ci-publish-${Date.now()}.log`;

// Auth: this project uses npm Trusted Publisher (OIDC) — no NPM_TOKEN needed.
// npm publish --provenance automatically exchanges the GitHub OIDC token for
// a short-lived npm token via ACTIONS_ID_TOKEN_REQUEST_URL / REQUEST_TOKEN
// which GitHub Actions injects into every child process env automatically.
// Nothing to configure here.

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

// Collect all publishable package.json paths
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
    // support packages/integrations/*/package.json
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

// Build map of workspace package name → published version
function buildWorkspaceVersionMap(packages) {
  const map = {};
  for (const { pkg } of packages) {
    map[pkg.name] = pkg.version;
  }
  return map;
}

// Rewrite workspace:* / workspace:^ in dep fields to ^semver
function rewriteWorkspaceDeps(pkgObj, versionMap) {
  const fields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  const original = {};
  let changed = false;
  for (const field of fields) {
    if (!pkgObj[field]) continue;
    original[field] = {};
    for (const [dep, ver] of Object.entries(pkgObj[field])) {
      original[field][dep] = ver;
      if (typeof ver === 'string' && ver.startsWith('workspace:')) {
        const resolved = versionMap[dep];
        if (resolved) {
          pkgObj[field][dep] = `^${resolved}`;
          changed = true;
        }
      }
    }
  }
  return { changed, original };
}

// Restore original dep values
function restoreWorkspaceDeps(pkgObj, original) {
  for (const [field, deps] of Object.entries(original)) {
    if (!pkgObj[field]) continue;
    for (const [dep, ver] of Object.entries(deps)) {
      pkgObj[field][dep] = ver;
    }
  }
}

// Check if a version is already published (idempotent publish guard)
function isAlreadyPublished(name, version) {
  try {
    const result = execSync(
      `npm view "${name}@${version}" version --registry https://registry.npmjs.org 2>/dev/null`,
      { encoding: 'utf-8' }
    ).trim();
    return result === version;
  } catch {
    return false;
  }
}

// Confirm package appears on registry after publish (retry x5, 10 s backoff)
function confirmPublished(name, version) {
  for (let i = 1; i <= 5; i++) {
    if (isAlreadyPublished(name, version)) {
      log(`✅ confirmed on registry: ${name}@${version}`);
      return;
    }
    if (i < 5) {
      log(`  registry not yet showing ${name}@${version} — waiting 10 s (attempt ${i}/5)`);
      execSync('sleep 10');
    }
  }
  throw new Error(`${name}@${version} not confirmed on registry after 5 attempts`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const packages = getPublishablePackages();
const versionMap = buildWorkspaceVersionMap(packages);
const provenanceFlag = process.env.NPM_PUBLISH_PROVENANCE === 'true' ? '--provenance' : '';

log(`publishing ${packages.length} package(s)`);
log(`log file: ${LOG_FILE}`);

const errors = [];

for (const { path: pkgPath, dir, pkg } of packages) {
  const { name, version } = pkg;

  log(`\n── ${name}@${version} ──`);

  // Idempotency: skip if already published
  if (isAlreadyPublished(name, version)) {
    log(`  already published — skipping`);
    continue;
  }

  // Rewrite workspace:* refs → ^semver
  const pkgObj = readJson(pkgPath);
  const { changed, original } = rewriteWorkspaceDeps(pkgObj, versionMap);
  if (changed) {
    log(`  rewriting workspace:* deps → semver`);
    writeJson(pkgPath, pkgObj);
  }

  try {
    const cmd = `npm publish --access public ${provenanceFlag}`.trim();
    log(`  $ ${cmd}`);
    let publishOut = '';
    try {
      publishOut = execSync(cmd, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf-8' });
      log(publishOut.trim());
    } catch (publishErr) {
      const stderr = (publishErr.stderr || '').trim();
      const stdout = (publishErr.stdout || '').trim();
      const detail = [stderr, stdout].filter(Boolean).join('\n');
      throw new Error(`npm publish failed:\n${detail || publishErr.message}`);
    }

    // Confirm appearance on registry
    confirmPublished(name, version);
  } catch (err) {
    log(`  ❌ FAILED: ${err.message}`);
    errors.push({ name, version, error: err.message });
  } finally {
    // Always restore original package.json
    if (changed) {
      const restored = readJson(pkgPath);
      restoreWorkspaceDeps(restored, original);
      writeJson(pkgPath, restored);
      log(`  restored workspace:* refs in package.json`);
    }
  }
}

if (errors.length > 0) {
  log(`\n❌ ${errors.length} package(s) failed to publish:`);
  for (const e of errors) {
    log(`  ${e.name}@${e.version}: ${e.error}`);
  }
  process.exit(1);
}

log(`\n✅ all packages published successfully`);
