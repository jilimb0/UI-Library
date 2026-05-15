import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { describe, expect, it } from 'vitest';

describe('Bundle Size', () => {
  const distPath = path.join(import.meta.dirname, '../../packages/core/dist');

  it('has acceptable gzip size', () => {
    if (!fs.existsSync(distPath)) {
      console.warn('dist not found, skipping bundle size check');
      return;
    }
    const jsFiles = fs.readdirSync(distPath).filter((f) => f.endsWith('.js'));
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distPath, file));
      const size = zlib.gzipSync(content).length;
      const sizeKb = Math.round(size / 1024);
      // index bundle: warn at 150KB, fail at 250KB (UI component library with styles)
      if (file.includes('index')) {
        expect(size, `index bundle too large: ${sizeKb}KB`).toBeLessThan(
          250 * 1024
        );
      }
      // any individual chunk: fail at 150KB
      expect(size, `chunk ${file} too large: ${sizeKb}KB`).toBeLessThan(
        150 * 1024
      );
    }
  });
});
