import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const storybookDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: process.env.STORYBOOK_BASE_PATH || '/storybook/',
  resolve: {
    alias: {
      '@ui-construction-library/tokens': resolve(
        storybookDir,
        '../../packages/tokens/src/index.ts'
      ),
      '@ui-construction-library/icons': resolve(
        storybookDir,
        '../../packages/icons/src/index.ts'
      ),
      '@ui-construction-library/utils': resolve(
        storybookDir,
        '../../packages/utils/src/index.ts'
      ),
      '@ui-construction-library/core': resolve(
        storybookDir,
        '../../packages/core/src/index.ts'
      ),
    },
  },
});
