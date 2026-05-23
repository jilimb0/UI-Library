#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const requiredFiles = [
  'docs/guides/integration-kits.md',
  'docs/guides/token-pipeline-multi-brand.md',
  'docs/guides/benchmark-dashboard.md',
  'apps/docs/content/production-recipes.md',
];

for (const relativePath of requiredFiles) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[gold-kits] Missing required artifact: ${relativePath}`);
    process.exit(1);
  }
}

console.log('[gold-kits] PASS: all W11-W12 artifacts are present.');
