import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/auth.test.ts',
      'src/commentRepository.test.ts',
      'src/dataServices.test.ts',
      'src/editorState.test.ts',
      'src/insertionRules.test.ts',
      'src/repositoryFactory.test.ts',
      'src/tree.test.ts',
      'src/versionRepository.test.ts',
    ],
    pool: 'threads',
    singleThread: true,
  },
});
