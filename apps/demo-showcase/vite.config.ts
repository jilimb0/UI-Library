import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.DEMO_BASE_PATH || '/demo/',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
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
      '@ui-construction-library/primitives': path.resolve(
        __dirname,
        '../../packages/primitives/src'
      ),
      '@ui-construction-library/motion': path.resolve(
        __dirname,
        '../../packages/motion/src'
      ),
      '@ui-construction-library/dnd': path.resolve(
        __dirname,
        '../../packages/dnd/src/index.tsx'
      ),
      '@ui-construction-library/react-hook-form': path.resolve(
        __dirname,
        '../../packages/integrations/react-hook-form/src'
      ),
      '@ui-construction-library/core-styles': path.resolve(
        __dirname,
        '../../packages/core/src/styles'
      ),
      '@ui-construction-library/tokens': path.resolve(
        __dirname,
        '../../packages/tokens/src'
      ),
      '@ui-construction-library/utils': path.resolve(
        __dirname,
        '../../packages/utils/src'
      ),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/')
          ) {
            return 'react-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
