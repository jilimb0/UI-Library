#!/usr/bin/env node

const { existsSync, readdirSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = resolve(__dirname, '..');
const searchRoots = ['packages', 'packages/integrations', 'apps'];

function collectPackageJsonFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;

    const packageJsonPath = join(full, 'package.json');
    if (existsSync(packageJsonPath)) {
      results.push(packageJsonPath);
    }

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
  }).trim();

  return output.replace(/^"|"$/g, '');
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

let hasMismatch = false;

for (const pkg of packages) {
  try {
    const npmVersion = getNpmVersion(pkg.name);

    if (npmVersion === pkg.version) {
      console.log(`PUBLISHED     ${pkg.name}@${pkg.version}`);
      continue;
    }

    console.log(
      `OUTDATED      ${pkg.name} local=${pkg.version} npm=${npmVersion}`
    );
    hasMismatch = true;
  } catch {
    console.log(`UNPUBLISHED   ${pkg.name}@${pkg.version}`);
    hasMismatch = true;
  }
}

process.exit(hasMismatch ? 1 : 0);
