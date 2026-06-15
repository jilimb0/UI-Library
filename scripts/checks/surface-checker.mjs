/**
 * Public surface checker — importable logic module.
 *
 * Separated from check-public-surface.mjs so that the detection rules can be
 * unit-tested independently of filesystem layout or CLI process exit codes.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

export const INTERNAL_NOTICE =
  'INTERNAL-ONLY: This package is not part of the public API surface.';

/**
 * Walk a directory tree, collecting files that match `predicate`.
 * Skips node_modules, dist, and dotfiles.
 */
export function walk(dir, predicate, results = []) {
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

/**
 * Build a regex that matches any import/require of `packageName` (including
 * subpath imports like `packageName/foo`).
 */
export function importPattern(packageName) {
  // Escape forward-slashes and at-signs that appear in scoped package names.
  const escaped = packageName.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
  return new RegExp(
    String.raw`(?:from\s+['"]${escaped}(?:\/[^'"]*)?['"]|import\s*\(\s*['"]${escaped}(?:\/[^'"]*)?['"]\s*\)|require\s*\(\s*['"]${escaped}(?:\/[^'"]*)?['"]\s*\))`,
  );
}

/**
 * Run all surface checks against `root`.
 *
 * @param {string} root - Absolute path to the workspace root.
 * @returns {string[]} Array of violation messages. Empty = all checks passed.
 */
export function checkSurface(root) {
  const matrixPath = join(root, 'config/package-surface.json');
  const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
  const configuredPackages = matrix.packages ?? {};

  const internalPackages = new Set(
    Object.entries(configuredPackages)
      .filter(([, entry]) => entry.surface === 'internal')
      .map(([name]) => name),
  );

  const violations = [];

  // ── 1. Collect all workspace @ui-construction-library/* package.json files ──
  const packageFiles = walk(
    join(root, 'packages'),
    (file) => file.endsWith('package.json'),
  );
  const workspacePackages = packageFiles
    .map((file) => ({
      file,
      pkg: JSON.parse(readFileSync(file, 'utf8')),
    }))
    .filter(({ pkg }) => pkg.name?.startsWith('@ui-construction-library/'));

  // ── 2. Per-package checks ──────────────────────────────────────────────────
  for (const { file, pkg } of workspacePackages) {
    const rel = relative(root, file);
    const entry = configuredPackages[pkg.name];

    if (!entry) {
      violations.push(
        `UNLISTED PACKAGE: ${pkg.name} is missing from config/package-surface.json (${rel})`,
      );
      continue;
    }

    if (entry.surface === 'internal') {
      const meta = pkg['ui-construction'];

      if (meta?.surface !== 'internal') {
        violations.push(
          `MISSING INTERNAL METADATA: ${pkg.name} must declare ui-construction.surface = "internal" (${rel})`,
        );
      }

      if (meta?.mode !== entry.mode) {
        violations.push(
          `MODE MISMATCH: ${pkg.name} declares mode "${meta?.mode ?? 'unset'}" but matrix expects "${entry.mode}" (${rel})`,
        );
      }

      const readmePath = join(dirname(file), 'README.md');
      if (!existsSync(readmePath)) {
        violations.push(
          `MISSING README: ${pkg.name} internal packages must include an INTERNAL-ONLY notice`,
        );
      } else {
        const readme = readFileSync(readmePath, 'utf8');
        if (!readme.includes(INTERNAL_NOTICE)) {
          violations.push(
            `MISSING INTERNAL NOTICE: ${relative(root, readmePath)} must include "${INTERNAL_NOTICE}"`,
          );
        }
      }
    }
  }

  // ── 3. Stale matrix entries (listed but no workspace package exists) ───────
  for (const packageName of Object.keys(configuredPackages)) {
    if (!workspacePackages.some(({ pkg }) => pkg.name === packageName)) {
      violations.push(
        `STALE MATRIX ENTRY: ${packageName} is listed in config/package-surface.json but no workspace package exists`,
      );
    }
  }

  // ── 4. Library-facing apps must not import internal packages ──────────────
  const libraryAppPaths = matrix.libraryApps ?? [];
  const libraryFiles = libraryAppPaths.flatMap((appPath) =>
    walk(
      join(root, appPath),
      (file) =>
        /\.(js|jsx|mjs|cjs|ts|tsx)$/.test(file) && !file.endsWith('.d.ts'),
    ),
  );

  for (const file of libraryFiles) {
    const rel = relative(root, file);
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');

    for (const packageName of internalPackages) {
      const pattern = importPattern(packageName);
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
          violations.push(
            `INTERNAL IMPORT: ${rel}:${i + 1} imports ${packageName}`,
          );
        }
      }
    }
  }

  return violations;
}
