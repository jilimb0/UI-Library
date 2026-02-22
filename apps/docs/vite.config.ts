import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], 
  resolve: {
    alias: {
      '@ui-lib/core': path.resolve(__dirname, '../../packages/core/src'),
      '@ui-lib/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@ui-lib/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3001,
    open: true
  }
});