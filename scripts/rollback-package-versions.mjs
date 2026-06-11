#!/usr/bin/env node
// Rolls back packages/*/package.json versions to last known published versions
// so pnpm install resolves cleanly and CI can publish fresh.
// Run once, then delete.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// package dir -> last published npm version
const rollback = {
  'packages/behaviors':            '0.1.0',
  'packages/dnd':                  '0.1.5',
  'packages/export-core':          '0.1.0',
  'packages/motion':               '0.1.3',
  'packages/primitives':           '0.1.2',
  'packages/prompt-engine':        '0.1.0',
  'packages/registry':             '0.1.0',
  'packages/schema':               '0.1.0',
  'packages/styles':               '0.1.0',
  'packages/integrations/next':    '0.1.0',
};

for (const [dir, version] of Object.entries(rollback)) {
  const pkgPath = resolve(root, dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const old = pkg.version;
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`  ${dir}: ${old} -> ${version}`);
}

console.log('\nDone. Now run: pnpm install && git add -A && git commit -m "chore: rollback unpublished package versions" && git push');
