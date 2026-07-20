import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button';
import { ErrorBoundary } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/Organisms/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

function BuggyComponent() {
  throw new Error('Something broke!');
}

function SafeComponent() {
  return <div>This renders fine.</div>;
}

export const NormalRender: Story = {
  render: () => (
    <ErrorBoundary>
      <SafeComponent />
    </ErrorBoundary>
  ),
};

export const CaughtError: Story = {
  render: () => (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  ),
};

export const WithCustomFallback: Story = {
  render: () => (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Custom fallback UI
        </div>
      }
    >
      <BuggyComponent />
    </ErrorBoundary>
  ),
};

function InteractiveDemo() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Error caught: {error.message}</p>
          <Button onClick={reset}>Try again</Button>
        </div>
      )}
    >
      <BuggyComponent />
    </ErrorBoundary>
  );
}

export const WithReset: Story = {
  render: () => <InteractiveDemo />,
};
