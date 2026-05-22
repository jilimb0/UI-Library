import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: false,
  },
  typescript: {
    check: false,
    reactDocgen: false,
  },
  viteFinal: async (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tailwindcss()],
    build: {
      ...config.build,
      chunkSizeWarningLimit: 1200,
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@ui-construction-library/tokens': resolve(
          __dirname,
          '../../../packages/tokens/src/index.ts'
        ),
        '@ui-construction-library/icons': resolve(
          __dirname,
          '../../../packages/icons/src/index.ts'
        ),
        '@ui-construction-library/utils': resolve(
          __dirname,
          '../../../packages/utils/src/index.ts'
        ),
        '@ui-construction-library/core': resolve(
          __dirname,
          '../../../packages/core/src/index.ts'
        ),
        '@ui-construction-library/motion': resolve(
          __dirname,
          '../../../packages/motion/src/index.ts'
        ),
        '@ui-construction-library/primitives': resolve(
          __dirname,
          '../../../packages/primitives/src/index.ts'
        ),
        '@ui-construction-library/dnd': resolve(
          __dirname,
          '../../../packages/dnd/src/index.tsx'
        ),
      },
    },
  }),
};

export default config;
