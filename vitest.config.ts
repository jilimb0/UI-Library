import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    // ✅ Абсолютный путь к setupFiles из корня
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    css: true,

    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'packages/*/src/**/*.test.{ts,tsx}',
      'packages/*/src/**/*.spec.{ts,tsx}',
    ],

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
