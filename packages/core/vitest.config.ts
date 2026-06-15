import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@ui-construction-library/icons': resolve(
        __dirname,
        '../icons/src/index.ts'
      ),
      '@ui-construction-library/primitives': resolve(
        __dirname,
        '../primitives/src/index.ts'
      ),
      '@ui-construction-library/behaviors': resolve(
        __dirname,
        '../behaviors/src/index.ts'
      ),
      '@ui-construction-library/tokens': resolve(
        __dirname,
        '../tokens/src/index.ts'
      ),
      '@ui-construction-library/utils': resolve(
        __dirname,
        '../utils/src/index.ts'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    server: {
      deps: {
        inline: ['jest-axe'],
      },
    },
    deps: {
      interopDefault: true,
    },
  },
});
