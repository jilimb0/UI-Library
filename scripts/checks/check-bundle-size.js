#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const rootDir = path.resolve(__dirname, '..', '..');
const coreBundlePath = path.join(rootDir, 'packages/core/dist/index.esm.js');
const coreStylesPath = path.join(rootDir, 'packages/core/dist/styles.css');

const coreBudgetKb = Number(process.env.CORE_BUNDLE_BUDGET_KB ?? 50);
const cssBudgetKb = Number(process.env.CSS_BUNDLE_BUDGET_KB ?? 20);

function gzippedSizeKb(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing bundle artifact: ${filePath}`);
  }

  const content = fs.readFileSync(filePath);
  const gzipped = zlib.gzipSync(content, { level: 9 });
  return gzipped.length / 1024;
}

function printResult(label, currentKb, budgetKb) {
  const status = currentKb <= budgetKb ? 'PASS' : 'FAIL';
  console.log(
    `${status} ${label}: ${currentKb.toFixed(2)}KB gz (budget ${budgetKb.toFixed(2)}KB)`
  );
  return status === 'PASS';
}

try {
  const coreKb = gzippedSizeKb(coreBundlePath);
  const cssKb = gzippedSizeKb(coreStylesPath);

  const coreOk = printResult(
    '@ui-construction-library/core',
    coreKb,
    coreBudgetKb
  );
  const cssOk = printResult('core styles.css', cssKb, cssBudgetKb);

  if (!coreOk || !cssOk) {
    process.exit(1);
  }
} catch (error) {
  console.error(
    `[bundle-size] ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
}
