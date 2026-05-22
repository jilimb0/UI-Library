#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(root, 'packages/core/src/index.ts');
const indexSource = readFileSync(indexPath, 'utf8');

const exportNames = [
  ...indexSource.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g),
  ...indexSource.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g),
]
  .flatMap((match) => {
    if (match[1]?.includes(',')) {
      return match[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim());
    }
    return [match[1]?.trim()].filter(Boolean);
  })
  .filter(Boolean)
  .sort();

const componentsDir = path.join(root, 'packages/core/src/components');
const layers = ['atoms', 'molecules', 'organisms', 'templates'];

const componentExports = [];
for (const layer of layers) {
  const layerDir = path.join(componentsDir, layer);
  if (!readdirSync(layerDir, { withFileTypes: true })) continue;
  for (const entry of readdirSync(layerDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const idx = path.join(layerDir, entry.name, 'index.ts');
      try {
        const src = readFileSync(idx, 'utf8');
        if (src.includes('export')) {
          componentExports.push(`${layer}/${entry.name}`);
        }
      } catch {
        /* no index */
      }
    }
  }
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  package: '@ui-construction-library/core',
  barrelExports: exportNames,
  componentModules: componentExports.sort(),
};

process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
