#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const registryDir = path.join(root, 'registry', 'source');
const requiredFiles = ['core.json', 'presets.json'];

function fail(message) {
  console.error(`[source-registry] ${message}`);
  process.exit(1);
}

for (const file of requiredFiles) {
  const full = path.join(registryDir, file);
  if (!fs.existsSync(full)) {
    fail(`Missing required file: registry/source/${file}`);
  }
}

const core = JSON.parse(
  fs.readFileSync(path.join(registryDir, 'core.json'), 'utf8')
);
const presets = JSON.parse(
  fs.readFileSync(path.join(registryDir, 'presets.json'), 'utf8')
);

if (!core.sourceMode) fail('core.json must set "sourceMode": true');
if (!Array.isArray(core.dependencies) || core.dependencies.length === 0) {
  fail('core.json must include non-empty dependencies array');
}

const presetNames = ['enterprise', 'saas', 'marketing'];
for (const name of presetNames) {
  const preset = presets.presets?.[name];
  if (!preset) fail(`presets.json missing "${name}" preset`);
  if (!Array.isArray(preset.dependencies) || preset.dependencies.length === 0) {
    fail(`preset "${name}" requires non-empty dependencies array`);
  }
}

console.log('[source-registry] PASS: source distribution registry is valid.');
