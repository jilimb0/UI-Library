import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import corePackageJson from '../../packages/core/package.json';

export default defineConfig({
  base: process.env.DOCS_BASE_PATH || '/docs/',
  plugins: [react(), tailwindcss()],
  define: {
    __CORE_PACKAGE_VERSION__: JSON.stringify(corePackageJson.version),
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
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
