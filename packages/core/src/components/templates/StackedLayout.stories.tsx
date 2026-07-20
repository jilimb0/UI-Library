import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedLayout } from './StackedLayout';

const meta: Meta<typeof StackedLayout> = {
  title: 'Templates/StackedLayout',
  component: StackedLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof StackedLayout>;

export const Default: Story = {
  args: {
    navbar: <div>Navigation bar</div>,
    children: <div>Main content</div>,
  },
};

export const WithoutNavbar: Story = {
  args: {
    children: <div>Main content without a navbar</div>,
  },
};
