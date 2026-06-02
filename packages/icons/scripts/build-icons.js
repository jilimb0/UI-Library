#!/usr/bin/env node
/**
 * Validates icon modules against the manifest source of truth.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconManifest } from '../src/icon-manifest.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '../src/icons');
const indexPath = path.join(__dirname, '../src/index.ts');
const readyIcons = iconManifest.filter((icon) => icon.status === 'ready');

const indexSource = fs.readFileSync(indexPath, 'utf8');
const exportMatch = indexSource.match(/export \{([\s\S]*?)\};/m);
const exportSection = exportMatch?.[1] ?? '';
const registrySection = indexSource.split('export const iconRegistry')[1] ?? '';

const seenNames = new Set();
const seenComponents = new Set();

for (const icon of readyIcons) {
  if (seenNames.has(icon.name)) {
    console.error(`Duplicate icon name in manifest: ${icon.name}`);
    process.exit(1);
  }

  if (seenComponents.has(icon.componentName)) {
    console.error(
      `Duplicate component name in manifest: ${icon.componentName}`
    );
    process.exit(1);
  }

  seenNames.add(icon.name);
  seenComponents.add(icon.componentName);

  const importLine = `import { ${icon.componentName} } from './icons/${icon.componentName}';`;
  if (!indexSource.includes(importLine)) {
    console.error(
      `Missing index import for manifest icon: ${icon.componentName}`
    );
    process.exit(1);
  }

  if (!exportSection.includes(icon.exportName)) {
    console.error(`Missing index export for manifest icon: ${icon.exportName}`);
    process.exit(1);
  }

  if (!registrySection.includes(`: ${icon.componentName}`)) {
    console.error(
      `Missing icon registry mapping for manifest icon: ${icon.componentName}`
    );
    process.exit(1);
  }

  const full = path.join(iconsDir, `${icon.componentName}.tsx`);
  if (!fs.existsSync(full)) {
    console.error(`Missing icon module: ${icon.componentName}.tsx`);
    process.exit(1);
  }
}

console.log(
  `Icon build check passed (${readyIcons.length} modules from manifest).`
);
