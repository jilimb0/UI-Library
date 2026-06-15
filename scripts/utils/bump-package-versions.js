#!/usr/bin/env node
/**
 * bump-package-versions.js
 *
 * Bumps the version field in package.json for every actionable package
 * (as reported by check-published-code.js --json on stdin) and regenerates
 * the per-package CHANGELOG.md via generate-package-changelogs.js.
 *
 * Usage (stdin from check-published-code.js --json):
 *   node scripts/checks/check-published-code.js --json \
 *     | node scripts/utils/bump-package-versions.js --bump=patch
 *
 * Flags:
 *   --bump=patch|minor|major  (default: patch)
 *   --dry-run                 print what would change, write nothing
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const ALLOWED_STATUSES = new Set([
  'CODE_MISMATCH',
  'OUTDATED',
  'UNPUBLISHED',
  'BROKEN_NPM',
]);

function parseArgs() {
  const args = process.argv.slice(2);
  let bump = 'patch';
  let dryRun = false;
  for (const a of args) {
    if (a.startsWith('--bump=')) bump = a.split('=')[1];
    if (a === '--dry-run') dryRun = true;
  }
  if (!['patch', 'minor', 'major'].includes(bump)) {
    console.error(`[bump] invalid bump type "${bump}", use patch|minor|major`);
    process.exit(1);
  }
  return { bump, dryRun };
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data.trim()));
  });
}

function semverBump(version, type) {
  const parts = version
    .replace(/^[^0-9]*/, '')
    .split('.')
    .map(Number);
  if (type === 'major') return `${parts[0] + 1}.0.0`;
  if (type === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function findPackageJsonForName(pkgName) {
  const searchRoots = ['packages', 'apps'];
  function walk(dir) {
    if (!fs.existsSync(dir)) return null;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const pj = path.join(full, 'package.json');
        if (fs.existsSync(pj)) {
          const pkg = JSON.parse(fs.readFileSync(pj, 'utf8'));
          if (pkg.name === pkgName) return pj;
        }
        const found = walk(full);
        if (found) return found;
      }
    }
    return null;
  }
  for (const root of searchRoots) {
    const found = walk(path.join(ROOT, root));
    if (found) return found;
  }
  return null;
}

async function main() {
  const { bump, dryRun } = parseArgs();
  const raw = await readStdin();

  let packages;
  try {
    packages = JSON.parse(raw);
  } catch {
    console.error(
      '[bump] failed to parse stdin as JSON from check-published-code.js --json'
    );
    process.exit(1);
  }

  const actionable = packages.filter((p) => ALLOWED_STATUSES.has(p.status));
  if (!actionable.length) {
    console.log('[bump] nothing to bump — all packages are up to date');
    process.exit(0);
  }

  const bumped = [];
  for (const pkg of actionable) {
    const pkgJsonPath = findPackageJsonForName(pkg.name);
    if (!pkgJsonPath) {
      console.warn(
        `[bump] warning: package.json not found for ${pkg.name}, skipping`
      );
      continue;
    }
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    const oldVersion = pkgJson.version;
    const newVersion = semverBump(oldVersion, bump);

    if (dryRun) {
      console.log(`[bump] dry-run  ${pkg.name}  ${oldVersion} → ${newVersion}`);
    } else {
      pkgJson.version = newVersion;
      fs.writeFileSync(
        pkgJsonPath,
        `${JSON.stringify(pkgJson, null, 2)}\n`,
        'utf8'
      );
      console.log(`[bump] bumped   ${pkg.name}  ${oldVersion} → ${newVersion}`);
    }
    bumped.push({
      name: pkg.name,
      dir: path.dirname(pkgJsonPath),
      oldVersion,
      newVersion,
    });
  }

  if (dryRun) {
    console.log('[bump] dry-run complete — no files written');
    return;
  }

  if (!bumped.length) return;

  // Regenerate per-package changelogs after bumping only for bumped packages
  console.log('[bump] regenerating package changelogs...');
  for (const pkg of bumped) {
    // Use spawnSync with separate args to avoid shell injection via pkg.name
    spawnSync(
      process.execPath,
      [
        path.join(__dirname, '../generators/generate-package-changelogs.js'),
        pkg.name,
      ],
      {
        cwd: ROOT,
        stdio: 'inherit',
      }
    );
  }

  console.log(`[bump] done — ${bumped.length} package(s) bumped`);
}

main();
