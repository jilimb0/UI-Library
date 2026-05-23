import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

/** Shared Vite aliases for demo, docs and Storybook apps. */
export function libraryAliases() {
  const preferDist = process.env.UI_LIBRARY_PREFER_DIST === 'true';
  const resolveEntry = (srcPath: string, distPath: string) => {
    const srcAbs = path.resolve(repoRoot, srcPath);
    const distAbs = path.resolve(repoRoot, distPath);

    if (!preferDist) {
      return srcAbs;
    }

    return existsSync(distAbs) ? distAbs : srcAbs;
  };

  return {
    '@ui-construction-library/core': resolveEntry(
      'packages/core/src',
      'packages/core/dist/index.esm.js'
    ),
    '@ui-construction-library/core/styles': resolveEntry(
      'packages/core/src/styles/index.css',
      'packages/core/dist/styles.css'
    ),
    '@ui-construction-library/icons': resolveEntry(
      'packages/icons/src',
      'packages/icons/dist/index.esm.js'
    ),
    '@ui-construction-library/tokens': resolveEntry(
      'packages/tokens/src',
      'packages/tokens/dist/index.esm.js'
    ),
    '@ui-construction-library/utils': resolveEntry(
      'packages/utils/src',
      'packages/utils/dist/index.esm.js'
    ),
    '@ui-construction-library/motion': resolveEntry(
      'packages/motion/src',
      'packages/motion/dist/index.esm.js'
    ),
    '@ui-construction-library/primitives': resolveEntry(
      'packages/primitives/src',
      'packages/primitives/dist/index.esm.js'
    ),
    '@ui-construction-library/dnd': resolveEntry(
      'packages/dnd/src/index.tsx',
      'packages/dnd/dist/index.esm.js'
    ),
    '@ui-construction-library/react-hook-form': resolveEntry(
      'packages/integrations/react-hook-form/src',
      'packages/integrations/react-hook-form/dist/index.esm.js'
    ),
  };
}
