import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.DEMO_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui-lib/core': path.resolve(__dirname, '../../packages/core/src'),
      '@ui-lib/icons': path.resolve(__dirname, '../../packages/icons/src'),
      '@ui-lib/react-hook-form': path.resolve(
        __dirname,
        '../../packages/integrations/react-hook-form/src'
      ),
    },
  },
});
