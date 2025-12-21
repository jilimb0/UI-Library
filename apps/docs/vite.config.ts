
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../../dist/docs',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@ui/docs': resolve(__dirname, 'src'),
    }
  }
});
