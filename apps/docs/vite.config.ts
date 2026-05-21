import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@ui-construction-library/core-styles': path.resolve(
        __dirname,
        '../../packages/core/src/styles'
      ),
      '@ui-construction-library/core': path.resolve(
        __dirname,
        '../../packages/core/src'
      ),
      '@ui-construction-library/icons': path.resolve(
        __dirname,
        '../../packages/icons/src'
      ),
      '@ui-construction-library/tokens': path.resolve(
        __dirname,
        '../../packages/tokens/src'
      ),
      '@ui-construction-library/utils': path.resolve(
        __dirname,
        '../../packages/utils/src'
      ),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
