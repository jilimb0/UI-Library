import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { libraryAliases } from '../../tools/vite/library-aliases';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      ...libraryAliases(),
    },
  },
});
