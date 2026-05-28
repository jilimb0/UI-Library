import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BUILDER_BASE_PATH || '/builder/',
  plugins: [react()],
});
