import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

const packagesDir = join(import.meta.dirname, '../../packages');

interface PackageBudget {
  name: string;
  dir: string;
  maxKb: number;
  bundleFile?: string;
}

const BUDGETS: PackageBudget[] = [
  { name: 'core', dir: 'core', maxKb: 150 },
  { name: 'tokens', dir: 'tokens', maxKb: 50 },
  { name: 'primitives', dir: 'primitives', maxKb: 30 },
  { name: 'icons', dir: 'icons', maxKb: 100 },
  { name: 'styles', dir: 'styles', maxKb: 20 },
  { name: 'motion', dir: 'motion', maxKb: 20 },
  { name: 'dnd', dir: 'dnd', maxKb: 30 },
  { name: 'behaviors', dir: 'behaviors', maxKb: 20 },
  { name: 'utils', dir: 'utils', maxKb: 20 },
];

describe('Bundle Size Budgets', () => {
  for (const budget of BUDGETS) {
    it(`${budget.name} does not exceed ${budget.maxKb}KB gzipped`, () => {
      const distPath = join(packagesDir, budget.dir, 'dist');

      if (!existsSync(distPath)) {
        console.warn(
          `dist not found for ${budget.dir}, skipping bundle size check`
        );
        return;
      }

      const files = readdirSync(distPath);

      // Prefer ESM bundle, fall back to CJS
      const bundleName =
        budget.bundleFile ??
        (files.includes('index.esm.js') ? 'index.esm.js' : 'index.js');

      const bundlePath = join(distPath, bundleName);

      if (!existsSync(bundlePath)) {
        // If no standard bundle, check all .js files for the largest
        const jsBundles = files.filter(
          (f) =>
            f.endsWith('.js') && !f.endsWith('.map') && !f.includes('.test.')
        );
        if (jsBundles.length === 0) {
          console.warn(
            `No JS bundle found for ${budget.dir}, skipping size check`
          );
          return;
        }
        const largest = jsBundles.reduce((a, b) => {
          const aSize = readFileSync(join(distPath, a)).length;
          const bSize = readFileSync(join(distPath, b)).length;
          return aSize > bSize ? a : b;
        });
        const content = readFileSync(join(distPath, largest));
        const gzipped = gzipSync(content);
        const sizeKb = Math.round(gzipped.length / 1024);
        expect(
          sizeKb,
          `${budget.name} bundle "${largest}" is ${sizeKb}KB, max allowed is ${budget.maxKb}KB`
        ).toBeLessThanOrEqual(budget.maxKb);
        return;
      }

      const content = readFileSync(bundlePath);
      const gzipped = gzipSync(content);
      const sizeKb = Math.round(gzipped.length / 1024);

      expect(
        sizeKb,
        `${budget.name} bundle is ${sizeKb}KB gzipped, max allowed is ${budget.maxKb}KB`
      ).toBeLessThanOrEqual(budget.maxKb);
    });
  }
});
