import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.DEMO_BASE_PATH || '/demo/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui-construction-library/core': path.resolve(
        __dirname,
        '../../packages/core/src'
      ),
      '@ui-construction-library/icons': path.resolve(
        __dirname,
        '../../packages/icons/src'
      ),
      '@ui-construction-library/react-hook-form': path.resolve(
        __dirname,
        '../../packages/integrations/react-hook-form/src'
      ),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'react-vendor';
          if (id.includes('node_modules/lucide-react')) return 'icons-vendor';
          if (id.includes('node_modules/@radix-ui')) return 'radix-vendor';
          return undefined;
        },
      },
    },
  },
});
