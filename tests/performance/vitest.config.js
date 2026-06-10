import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@ui-construction-library/export-core': path.resolve(
        import.meta.dirname,
        '../../packages/export-core/src'
      ),
      '@ui-construction-library/registry': path.resolve(
        import.meta.dirname,
        '../../packages/registry/src'
      ),
      '@ui-construction-library/schema': path.resolve(
        import.meta.dirname,
        '../../packages/schema/src'
      ),
      '@ui-construction-library/styles': path.resolve(
        import.meta.dirname,
        '../../packages/styles/src'
      ),
      '@ui-construction-library/tokens': path.resolve(
        import.meta.dirname,
        '../../packages/tokens/src'
      ),
    },
  },
  test: {
    globals: false,
    environment: 'node',
    include: ['tests/performance/**/*.test.{js,ts}'],
  },
});
