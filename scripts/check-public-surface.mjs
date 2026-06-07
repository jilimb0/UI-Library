#!/usr/bin/env node
/**
 * Validates the public/internal package surface contract.
 *
 * Checks:
 *   1. Every @ui-construction-library workspace package is listed in config/package-surface.json.
 *   2. Internal package.json manifests carry matching ui-construction metadata.
 *   3. Internal package README files include the INTERNAL-ONLY notice.
 *   4. Library-facing apps do not import internal packages.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MATRIX_PATH = join(ROOT, 'config/package-surface.json');
const NOTICE = 'INTERNAL-ONLY: This package is not part of the public API surface.';

const matrix = JSON.parse(readFileSync(MATRIX_PATH, 'utf8'));
const configuredPackages = matrix.packages ?? {};
const internalPackages = new Set(
  Object.entries(configuredPackages)
    .filter(([, entry]) => entry.surface === 'internal')
    .map(([name]) => name),
);

const violations = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function walk(dir, predicate, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) {
      continue;
    }
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, predicate, results);
    } else if (predicate(full)) {
      results.push(full);
    }
  }
  return results;
}

function findWorkspacePackageJsonFiles() {
  return [
    ...walk(join(ROOT, 'packages'), (file) => file.endsWith('package.json')),
  ];
}

function findSourceFiles(paths) {
  return paths.flatMap((basePath) =>
    walk(join(ROOT, basePath), (file) => /\.(js|jsx|mjs|cjs|ts|tsx)$/.test(file) && !file.endsWith('.d.ts')),
  );
}

function importPattern(packageName) {
  return new RegExp(
    String.raw`(?:from\s+['"]${packageName}(?:\/[^'"]*)?['"]|import\s*\(\s*['"]${packageName}(?:\/[^'"]*)?['"]\s*\)|require\s*\(\s*['"]${packageName}(?:\/[^'"]*)?['"]\s*\))`,
  );
}

const packageFiles = findWorkspacePackageJsonFiles();
const workspacePackages = packageFiles
  .map((file) => ({ file, pkg: readJson(file) }))
  .filter(({ pkg }) => pkg.name?.startsWith('@ui-construction-library/'));

for (const { file, pkg } of workspacePackages) {
  const rel = relative(ROOT, file);
  const surface = configuredPackages[pkg.name];

  if (!surface) {
    violations.push(`UNLISTED PACKAGE: ${pkg.name} is missing from config/package-surface.json (${rel})`);
    continue;
  }

  const metadata = pkg['ui-construction'];
  if (surface.surface === 'internal') {
    if (metadata?.surface !== 'internal') {
      violations.push(`MISSING INTERNAL METADATA: ${pkg.name} must declare ui-construction.surface = "internal" (${rel})`);
    }
    if (metadata?.mode !== surface.mode) {
      violations.push(`MODE MISMATCH: ${pkg.name} declares mode "${metadata?.mode ?? 'unset'}" but matrix expects "${surface.mode}" (${rel})`);
    }

    const readmePath = join(dirname(file), 'README.md');
    if (!existsSync(readmePath)) {
      violations.push(`MISSING README: ${pkg.name} internal packages must include an INTERNAL-ONLY notice`);
    } else {
      const readme = readFileSync(readmePath, 'utf8');
      if (!readme.includes(NOTICE)) {
        violations.push(`MISSING INTERNAL NOTICE: ${relative(ROOT, readmePath)} must include "${NOTICE}"`);
      }
    }
  }
}

for (const packageName of Object.keys(configuredPackages)) {
  if (!workspacePackages.some(({ pkg }) => pkg.name === packageName)) {
    violations.push(`STALE MATRIX ENTRY: ${packageName} is listed in config/package-surface.json but no workspace package exists`);
  }
}

const libraryFiles = findSourceFiles(matrix.libraryApps ?? []);
for (const file of libraryFiles) {
  const rel = relative(ROOT, file);
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (const packageName of internalPackages) {
    const pattern = importPattern(packageName);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (pattern.test(line)) {
        violations.push(`INTERNAL IMPORT: ${rel}:${index + 1} imports ${packageName}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Public surface check failed:');
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log('Public surface check passed.');
