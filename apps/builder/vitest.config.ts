import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@ui-construction-library/registry': fileURLToPath(
        new URL('../../packages/registry/src/index.ts', import.meta.url)
      ),
    },
  },
  test: {
    environment: 'node',
    include: [
      'src/auth.test.ts',
      'src/builderControllers.test.ts',
      'src/builderEditorController.test.ts',
      'src/commentRepository.test.ts',
      'src/dataServices.test.ts',
      'src/editorState.test.ts',
      'src/insertionRules.test.ts',
      'src/repositoryFactory.test.ts',
      'src/tree.test.ts',
      'src/versionRepository.test.ts',
      'src/schemaGuard.test.ts',
    ],
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
