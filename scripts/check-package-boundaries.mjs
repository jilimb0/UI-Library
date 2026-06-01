#!/usr/bin/env node
/**
 * check-package-boundaries.mjs
 *
 * Validates that workspace package dependencies conform to the architecture
 * rules defined in ARCHITECTURE.md. Run with:
 *
 *   node scripts/check-package-boundaries.mjs
 *
 * Exits 0 if all rules pass, 1 if any violation is found.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');

// ---------------------------------------------------------------------------
// Package name → short alias mapping
// ---------------------------------------------------------------------------
const ALIAS = {
  '@ui-construction-library/core': 'core',
  '@ui-construction-library/tokens': 'tokens',
  '@ui-construction-library/icons': 'icons',
  '@ui-construction-library/utils': 'utils',
  '@ui-construction-library/primitives': 'primitives',
  '@ui-construction-library/motion': 'motion',
  '@ui-construction-library/dnd': 'dnd',
  '@ui-construction-library/react-hook-form': 'react-hook-form',
  '@ui-construction-library/export-core': 'export-core',
  '@ui-construction-library/prompt-engine': 'prompt-engine',
  '@ui-construction-library/registry': 'registry',
  '@ui-construction-library/schema': 'schema',
  '@ui-construction-library/styles': 'styles',
};

// ---------------------------------------------------------------------------
// Forbidden dependency edges  [from, to]
// ---------------------------------------------------------------------------
const FORBIDDEN = [
  ['tokens', 'core'],
  ['icons', 'core'],
  ['utils', 'core'],
  ['primitives', 'core'],   // primitives must not depend on core
  ['motion', 'dnd'],
  ['dnd', 'motion'],
  ['react-hook-form', 'motion'],
  ['react-hook-form', 'dnd'],
];

// ---------------------------------------------------------------------------
// Required dependency edges  [from, to, reason]
// ---------------------------------------------------------------------------
const REQUIRED = [
  ['motion', 'core', 'motion must extend core'],
  ['dnd', 'core', 'dnd must extend core'],
  ['react-hook-form', 'core', 'react-hook-form must extend core'],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function findPackageJsonFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findPackageJsonFiles(full, results);
    } else if (entry === 'package.json') {
      results.push(full);
    }
  }
  return results;
}

function alias(name) {
  return ALIAS[name] ?? name;
}

function allDeps(pkg) {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const packageFiles = findPackageJsonFiles(join(ROOT, 'packages'));
const packages = packageFiles
  .map((f) => {
    try {
      return JSON.parse(readFileSync(f, 'utf8'));
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .filter((p) => p.name?.startsWith('@ui-construction-library/'));

const violations = [];

for (const pkg of packages) {
  const from = alias(pkg.name);
  const deps = allDeps(pkg).map(alias);

  // Check forbidden edges
  for (const [f, t] of FORBIDDEN) {
    if (from === f && deps.includes(t)) {
      violations.push(`FORBIDDEN: ${pkg.name} → @ui-construction-library/${t}`);
    }
  }

  // Check required edges
  for (const [f, t, reason] of REQUIRED) {
    if (from === f && !deps.includes(t)) {
      violations.push(`MISSING REQUIRED: ${pkg.name} must depend on @ui-construction-library/${t} (${reason})`);
    }
  }

  // Check sideEffects is declared
  if (pkg.sideEffects === undefined) {
    violations.push(`MISSING sideEffects: ${pkg.name} — declare "sideEffects": false or ["*.css"]`);
  }

  // Check exports is declared
  if (!pkg.exports || Object.keys(pkg.exports).length === 0) {
    violations.push(`MISSING exports: ${pkg.name} — declare an explicit exports map`);
  }
}

if (violations.length === 0) {
  console.log('✅  Package boundary check passed — all rules satisfied.');
  process.exit(0);
} else {
  console.error('❌  Package boundary violations found:\n');
  for (const v of violations) {
    console.error(`  • ${v}`);
  }
  console.error(`\n${violations.length} violation(s). See ARCHITECTURE.md for the rules.`);
  process.exit(1);
}
