#!/usr/bin/env node
/**
 * CLI entry point for the public/internal package surface validator.
 *
 * Checks:
 *   1. Every @ui-construction-library workspace package is listed in config/package-surface.json.
 *   2. Internal package.json manifests carry matching ui-construction metadata.
 *   3. Internal package README files include the INTERNAL-ONLY notice.
 *   4. Library-facing apps do not import internal packages.
 *
 * Logic lives in scripts/surface-checker.mjs so it can be unit-tested
 * independently of process.exit and filesystem layout.
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSurface } from './surface-checker.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const violations = checkSurface(ROOT);

if (violations.length > 0) {
  console.error('Public surface check failed:');
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
}

console.log('Public surface check passed.');
