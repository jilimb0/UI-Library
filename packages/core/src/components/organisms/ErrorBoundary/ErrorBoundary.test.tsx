import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function Bomb({ shouldThrow }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal render</div>;
}

// Suppress console.error for expected error boundary catches
let consoleSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  consoleSpy.mockRestore();
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders default fallback on error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred. Please try again.')
    ).toBeInTheDocument();
  });

  it('renders custom fallback element', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error</div>}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('renders custom fallback function with reset', async () => {
    const user = userEvent.setup();

    function ControlledBomb() {
      const [explode, setExplode] = useState(true);
      return (
        <ErrorBoundary
          fallback={(error, reset) => (
            <div>
              <span>Error: {error.message}</span>
              <button
                type="button"
                onClick={() => {
                  setExplode(false);
                  reset();
                }}
              >
                Reset
              </button>
            </div>
          )}
        >
          <Bomb shouldThrow={explode} />
        </ErrorBoundary>
      );
    }

    render(<ControlledBomb />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    await user.click(screen.getByText('Reset'));
    expect(screen.getByText('Normal render')).toBeInTheDocument();
  });

  it('calls onError when an error is caught', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('detects chunk load errors', () => {
    function ChunkBomb() {
      const error = new Error('Loading chunk failed');
      error.name = 'ChunkLoadError';
      throw error;
    }
    render(
      <ErrorBoundary>
        <ChunkBomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Failed to load module')).toBeInTheDocument();
    expect(screen.getByText('Reload page')).toBeInTheDocument();
  });
});
