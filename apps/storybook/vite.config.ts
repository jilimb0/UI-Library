import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@ui-lib/tokens': resolve(
        __dirname,
        '../../packages/tokens/src/index.ts'
      ),
      '@ui-lib/icons': resolve(__dirname, '../../packages/icons/src/index.ts'),
      '@ui-lib/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@ui-lib/core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
});
