#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const required = [
  'docs/release/V1_EXCELLENCE_RELEASE_NOTES.md',
  'docs/guides/migration-v1.md',
  'docs/guides/benchmark-dashboard.md',
  'docs/guides/market-comparison.md',
  'docs/release/FEEDBACK_SLA.md',
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`[launch-check] Missing required launch artifact: ${file}`);
    process.exit(1);
  }
}

console.log('[launch-check] PASS: launch artifacts are present.');
