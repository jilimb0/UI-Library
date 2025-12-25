
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../../dist/playground',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@ui/core': resolve(__dirname, '../../packages/core/src'),
      '@ui/utils': resolve(__dirname, '../../packages/utils/src')
    }
  }
});
