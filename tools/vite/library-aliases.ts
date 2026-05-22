import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

/** Shared Vite aliases for demo, docs and Storybook apps. */
export function libraryAliases() {
  return {
    '@ui-construction-library/core': path.resolve(
      repoRoot,
      'packages/core/src'
    ),
    '@ui-construction-library/core/styles': path.resolve(
      repoRoot,
      'packages/core/src/styles/index.css'
    ),
    '@ui-construction-library/icons': path.resolve(
      repoRoot,
      'packages/icons/src'
    ),
    '@ui-construction-library/tokens': path.resolve(
      repoRoot,
      'packages/tokens/src'
    ),
    '@ui-construction-library/utils': path.resolve(
      repoRoot,
      'packages/utils/src'
    ),
    '@ui-construction-library/motion': path.resolve(
      repoRoot,
      'packages/motion/src'
    ),
    '@ui-construction-library/primitives': path.resolve(
      repoRoot,
      'packages/primitives/src'
    ),
    '@ui-construction-library/dnd': path.resolve(
      repoRoot,
      'packages/dnd/src/index.tsx'
    ),
    '@ui-construction-library/react-hook-form': path.resolve(
      repoRoot,
      'packages/integrations/react-hook-form/src'
    ),
  };
}
