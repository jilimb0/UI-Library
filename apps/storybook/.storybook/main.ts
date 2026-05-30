import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { libraryAliases } from '../../../tools/vite/library-aliases';

const coreStoriesDir = path.resolve(__dirname, '../../../packages/core/src');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    `${coreStoriesDir}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
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
      dedupe: ['react', 'react-dom', ...(config.resolve?.dedupe ?? [])],
      alias: {
        ...(config.resolve?.alias ?? {}),
        ...libraryAliases(),
      },
    },
  }),
};

export default config;
