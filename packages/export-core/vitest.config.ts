import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json'],
      thresholds: {
        global: {
          statements: 60,
          branches: 60,
          functions: 60,
          lines: 60,
        },
      },
    },
  },
});
