import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ui-construction-library/core': path.resolve(
        __dirname,
        '../../packages/core/src'
      ),
      '@ui-construction-library/utils': path.resolve(
        __dirname,
        '../../packages/utils/src'
      ),
      '@ui-construction-library/tokens': path.resolve(
        __dirname,
        '../../packages/tokens/src'
      ),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
