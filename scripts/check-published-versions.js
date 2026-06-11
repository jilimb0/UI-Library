#!/usr/bin/env node

// Usage:
//   node check-published-versions.js           # default: 1 attempt, no delay
//   node check-published-versions.js --retry   # 5 attempts, 30s delay (post-publish CI)

const { existsSync, readdirSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const RETRY_MODE = process.argv.includes('--retry');
const MAX_ATTEMPTS = RETRY_MODE ? 5 : 1;
const RETRY_DELAY_MS = 30_000;

const repoRoot = resolve(__dirname, '..');
const searchRoots = ['packages', 'packages/integrations', 'apps'];
const unpublishedAllowed = new Set(['@ui-construction-library/behaviors']);

function collectPackageJsonFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    const packageJsonPath = join(full, 'package.json');
    if (existsSync(packageJsonPath)) results.push(packageJsonPath);
    results.push(...collectPackageJsonFiles(full));
  }
  return results;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function getNpmVersion(pkgName) {
  const output = execFileSync('npm', ['view', pkgName, 'version', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15_000,
  }).trim();
  return output.replace(/^"|"$/g, '');
}

function sleep(ms) {
  spawnSync('sleep', [String(ms / 1000)]);
}

const packageJsonFiles = searchRoots.flatMap((root) =>
  collectPackageJsonFiles(join(repoRoot, root))
);

const packages = packageJsonFiles
  .map((path) => readJson(path))
  .filter(
    (pkg) =>
      pkg.name?.startsWith('@ui-construction-library/') &&
      typeof pkg.version === 'string'
  );

// Deduplicate by name (packages/integrations/* are also found under packages/*)
const seen = new Set();
const uniquePackages = packages.filter((pkg) => {
  if (seen.has(pkg.name)) return false;
  seen.add(pkg.name);
  return true;
});

function runCheck() {
  let hasMismatch = false;
  const results = [];

  for (const pkg of uniquePackages) {
    try {
      const npmVersion = getNpmVersion(pkg.name);
      if (npmVersion === pkg.version) {
        results.push(`PUBLISHED     ${pkg.name}@${pkg.version}`);
      } else {
        results.push(
          `OUTDATED      ${pkg.name} local=${pkg.version} npm=${npmVersion}`
        );
        hasMismatch = true;
      }
    } catch {
      if (unpublishedAllowed.has(pkg.name)) {
        results.push(`ALLOWED       ${pkg.name}@${pkg.version} (unpublished)`);
      } else {
        results.push(`UNPUBLISHED   ${pkg.name}@${pkg.version}`);
        hasMismatch = true;
      }
    }
  }

  return { hasMismatch, results };
}

let attempt = 0;
while (attempt < MAX_ATTEMPTS) {
  attempt++;

  if (RETRY_MODE) {
    console.log(
      `\n[published-versions] Attempt ${attempt}/${MAX_ATTEMPTS}${
        attempt > 1 ? ` (after ${RETRY_DELAY_MS / 1000}s delay)` : ''
      }`
    );
  }

  const { hasMismatch, results } = runCheck();
  for (const r of results) console.log(r);

  if (!hasMismatch) {
    process.exit(0);
  }

  if (attempt < MAX_ATTEMPTS) {
    console.log(
      `[published-versions] Some packages not yet visible — retrying in ${RETRY_DELAY_MS / 1000}s...`
    );
    sleep(RETRY_DELAY_MS);
  }
}

process.exit(1);
