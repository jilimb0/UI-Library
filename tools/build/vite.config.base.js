
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'UILibrary',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    }
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
});
