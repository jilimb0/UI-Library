import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button';
import { ToastProvider, useToast } from './ToastProvider';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Molecules/ToastProvider',
  component: ToastProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

function DemoAll() {
  const { push, dismissAll } = useToast();
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => push({ message: 'Default toast' })}>
        Default
      </Button>
      <Button onClick={() => push({ message: 'Success!', variant: 'success' })}>
        Success
      </Button>
      <Button onClick={() => push({ message: 'Warning!', variant: 'warning' })}>
        Warning
      </Button>
      <Button onClick={() => push({ message: 'Error!', variant: 'error' })}>
        Error
      </Button>
      <Button onClick={() => push({ message: 'Info', variant: 'info' })}>
        Info
      </Button>
      <Button variant="destructive" onClick={dismissAll}>
        Dismiss all
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <DemoAll />
    </ToastProvider>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <ToastProvider>
      <DemoAll />
    </ToastProvider>
  ),
};

export const BottomLeft: Story = {
  render: () => (
    <ToastProvider position="bottom-left">
      <DemoAll />
    </ToastProvider>
  ),
};

export const TopRight: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <DemoAll />
    </ToastProvider>
  ),
};
