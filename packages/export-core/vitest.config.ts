import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@ui-construction-library/prompt-engine': resolve(
        __dirname,
        '../prompt-engine/src/index.ts'
      ),
      '@ui-construction-library/schema': resolve(
        __dirname,
        '../schema/src/index.ts'
      ),
      '@ui-construction-library/registry': resolve(
        __dirname,
        '../registry/src/index.ts'
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    pool: 'threads',
    singleThread: true,
  },
});
