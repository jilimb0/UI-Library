import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@ui-construction-library/tokens': resolve(
        __dirname,
        '../../packages/tokens/src/index.ts'
      ),
      '@ui-construction-library/icons': resolve(
        __dirname,
        '../../packages/icons/src/index.ts'
      ),
      '@ui-construction-library/utils': resolve(
        __dirname,
        '../../packages/utils/src/index.ts'
      ),
      '@ui-construction-library/core': resolve(
        __dirname,
        '../../packages/core/src/index.ts'
      ),
    },
  },
});
