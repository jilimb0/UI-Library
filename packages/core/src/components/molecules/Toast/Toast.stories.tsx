import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Molecules/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    duration: { control: 'number' },
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

export const Success: Story = {
  args: {
    children: 'Changes saved successfully',
    variant: 'success',
    duration: 3000,
  },
};

export const Warning: Story = {
  args: {
    children: 'Your session is about to expire',
    variant: 'warning',
    duration: 5000,
  },
};

export const ErrorVariant: Story = {
  args: {
    children: 'Failed to save changes. Please try again.',
    variant: 'error',
    duration: 5000,
  },
};

export const Info: Story = {
  args: {
    children: 'New updates are available',
    variant: 'info',
    duration: 3000,
  },
};

export const WithCloseButton: Story = {
  args: {
    children: 'Dismiss me',
    variant: 'info',
    duration: 0,
    onClose: () => alert('Toast dismissed'),
  },
};

export const Persistent: Story = {
  args: {
    children: 'This toast will not auto-dismiss',
    duration: 0,
  },
};

export const LongMessage: Story = {
  args: {
    children:
      'This is a longer toast message that demonstrates how the component handles extended content without breaking the layout. It should wrap gracefully.',
    duration: 5000,
  },
};
