
import { create } from '@storybook/theming';

export const withTheme = (Story, context) => {
  return <div style={{ padding: '20px', backgroundColor: context.globals.backgrounds.value }}>
    <Story {...context} />
  </div>;
};

export const customTheme = create({
  base: 'light',
  brandTitle: '@ui Storybook',
  brandUrl: '#',
  colorPrimary: '#3b82f6',
  colorSecondary: '#60a5fa',
  appBg: '#f0f0f0',
  appContentBg: '#ffffff',
  fontBase: 'system-ui, sans-serif',
  barBg: '#3b82f6',
  barSelectedColor: '#ffffff',
  barTextColor: '#ffffff',
  inputBg: '#444444',
  inputBorder: '#666666',
  inputTextColor: '#eeeeee',
  inputBorderRadius: 4,
});
