import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachMark } from './CoachMark';

const meta: Meta<typeof CoachMark> = {
  title: 'Components/Molecules/CoachMark',
  component: CoachMark,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CoachMark>;

export const Default: Story = {
  args: {
    id: 'default',
    title: 'Did you know?',
    children: 'You can use keyboard shortcuts to navigate faster.',
  },
};

export const WithoutTitle: Story = {
  args: {
    id: 'no-title',
    children: 'Just a simple tip without a heading.',
  },
};

export const CustomDismiss: Story = {
  args: {
    id: 'custom-dismiss',
    title: 'New feature',
    children: 'Try the new dark mode in settings.',
    dismissLabel: 'OK, thanks',
  },
};
