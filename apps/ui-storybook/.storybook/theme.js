
// Basic Storybook Theme
import { create } from 'storybook/theming';

export default create({
  base: 'light',
  brandTitle: 'UI Library',
  brandUrl: 'https://github.com/yourorg/ui-library',
  brandImage: 'https://placehold.co/350x150?text=UI+Library',
  colorPrimary: '#1E90FF',
  colorSecondary: '#FF4785',
  appBg: '#F6F9FC',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E2E2E2',
  appBorderRadius: 4,
  fontBase: 'Roboto, sans-serif',
  fontCode: 'monospace'
});
