import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { libraryAliases } from '../../tools/vite/library-aliases';

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      ...libraryAliases(),
    },
  },
});
