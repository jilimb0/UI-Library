import type { Preview } from '@storybook/react';
import '../../../packages/core/src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    a11y: { test: 'error' }
  }
};

export default preview;
