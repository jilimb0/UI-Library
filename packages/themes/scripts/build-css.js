/**
 * build-css.js — Copy theme CSS sources to dist/
 *
 * The themes package is CSS-only. This script copies source CSS files
 * from src/ to dist/ so they're available at the package's export paths.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcDir = resolve(root, 'src');
const distDir = resolve(root, 'dist');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy all .css files from src to dist
const files = readdirSync(srcDir).filter((f) => f.endsWith('.css'));

for (const file of files) {
  copyFileSync(resolve(srcDir, file), resolve(distDir, file));
  console.log(`  ✓ dist/${file}`);
}

console.log(`\n✓ Copied ${files.length} CSS file(s) to dist/`);
