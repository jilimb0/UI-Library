/**
 * test-css.js — Validate themes CSS output
 *
 * Verifies that:
 *   1. All expected dist/ files exist
 *   2. Each CSS file has correct [data-theme] selector
 *   3. Each file contains required CSS variables
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const THEMES = [
  { file: 'theme-light.css', selector: '[data-theme="light"]' },
  { file: 'theme-dark.css', selector: '[data-theme="dark"]' },
  { file: 'theme-neutral.css', selector: '[data-theme="neutral"]' },
];

const REQUIRED_VARS = [
  '--ucl-color-background',
  '--ucl-color-foreground',
  '--ucl-color-primary',
  '--ucl-color-border',
  '--ucl-background',
  '--ucl-foreground',
  '--ucl-primary',
  '--ucl-border',
  '--ucl-font-sans',
  '--ucl-text-base',
  '--ucl-spacing-4',
  '--ucl-radius-md',
  '--ucl-shadow-sm',
  '--background',
  '--foreground',
  '--primary',
];

let failed = false;

for (const theme of THEMES) {
  const filePath = resolve(root, 'dist', theme.file);

  if (!existsSync(filePath)) {
    console.error(`✗ MISSING: dist/${theme.file}`);
    failed = true;
    continue;
  }

  const css = readFileSync(filePath, 'utf-8');
  const lines = css.split('\n');

  // Check data-theme selector
  if (!css.includes(theme.selector)) {
    console.error(`✗ ${theme.file}: Missing selector "${theme.selector}"`);
    failed = true;
  }

  // Check required CSS variables
  const missingVars = REQUIRED_VARS.filter((v) => !css.includes(v));

  if (missingVars.length > 0) {
    console.error(`✗ ${theme.file}: Missing variables:`);
    for (const v of missingVars) {
      console.error(`    ${v}`);
    }
    failed = true;
  }

  if (!failed) {
    console.log(`  ✓ ${theme.file} (${lines.length} lines)`);
  }
}

if (failed) {
  console.error('\n✗ Some theme files failed validation');
  process.exit(1);
}

console.log('\n✓ All theme files validated successfully');
