import path from 'node:path';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@ui-construction-library/core': path.resolve(
        __dirname,
        'packages/core/src'
      ),
      '@ui-construction-library/primitives': path.resolve(
        __dirname,
        'packages/primitives/src'
      ),
      '@ui-construction-library/behaviors': path.resolve(
        __dirname,
        'packages/behaviors/src'
      ),
      '@ui-construction-library/icons': path.resolve(
        __dirname,
        'packages/icons/src'
      ),
      '@ui-construction-library/tokens': path.resolve(
        __dirname,
        'packages/tokens/src'
      ),
      '@ui-construction-library/utils': path.resolve(
        __dirname,
        'packages/utils/src'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    css: true,

    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'apps/*/src/**/*.test.{ts,tsx}',
      'apps/*/src/**/*.spec.{ts,tsx}',
      'packages/*/src/**/*.test.{ts,tsx}',
      'packages/*/src/**/*.spec.{ts,tsx}',
      'packages/integrations/*/src/**/*.test.{ts,tsx}',
      'packages/integrations/*/src/**/*.spec.{ts,tsx}',
      'tests/**/*.test.{ts,tsx,js}',
      'tests/**/*.spec.{ts,tsx,js}',
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
};
