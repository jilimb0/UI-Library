import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Molecules/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'number' },
      description: 'Duration in milliseconds before auto-dismiss',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    children: 'This is a toast notification',
    duration: 3000,
  },
};

export const LongMessage: Story = {
  args: {
    children:
      'This is a longer toast message that contains more information about what happened.',
    duration: 5000,
  },
};

export const WithCustomDuration: Story = {
  args: {
    children: 'This toast will stay for 10 seconds',
    duration: 10000,
  },
};
