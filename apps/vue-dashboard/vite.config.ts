import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { libraryAliases } from '../../tools/vite/library-aliases';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      ...libraryAliases(),
    },
  },
});
