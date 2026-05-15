import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ui-lib/core': path.resolve(__dirname, '../../packages/core/src'),
      '@ui-lib/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@ui-lib/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom')
          ) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
          if (id.includes('node_modules/zod')) {
            return 'zod-vendor';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
});
