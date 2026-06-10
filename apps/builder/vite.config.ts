import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BUILDER_BASE_PATH || '/builder/',
  plugins: [react()],
  resolve: {
    preserveSymlinks: false,
    alias: {
      '@ui-construction-library/export-core': fileURLToPath(
        new URL('../../packages/export-core/src/index.ts', import.meta.url)
      ),
      '@ui-construction-library/prompt-engine': fileURLToPath(
        new URL('../../packages/prompt-engine/src/index.ts', import.meta.url)
      ),
    },
  },
});
