import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
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
