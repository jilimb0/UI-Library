import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import corePackageJson from '../../packages/core/package.json';
import { libraryAliases } from '../../tools/vite/library-aliases';

export default defineConfig({
  base: process.env.DOCS_BASE_PATH || '/docs/',
  plugins: [react(), tailwindcss()],
  define: {
    __CORE_PACKAGE_VERSION__: JSON.stringify(corePackageJson.version),
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      ...libraryAliases(),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
