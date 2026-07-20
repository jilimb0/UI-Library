import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './ToastProvider';

function TestHarness() {
  const { push, dismissAll } = useToast();
  return (
    <div>
      <button type="button" onClick={() => push({ message: 'Hello' })}>
        Push toast
      </button>
      <button
        type="button"
        onClick={() => push({ message: 'Success', variant: 'success' })}
      >
        Push success
      </button>
      <button type="button" onClick={dismissAll}>
        Dismiss all
      </button>
    </div>
  );
}

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('pushes and displays a toast', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>
    );
    await user.click(screen.getByText('Push toast'));
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('pushes multiple toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>
    );
    await user.click(screen.getByText('Push toast'));
    await user.click(screen.getByText('Push success'));
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('dismisses all toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>
    );
    await user.click(screen.getByText('Push toast'));
    await user.click(screen.getByText('Push success'));
    await user.click(screen.getByText('Dismiss all'));
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });

  it('respects maxToasts limit', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider maxToasts={2}>
        <TestHarness />
      </ToastProvider>
    );
    await user.click(screen.getByText('Push toast'));
    await user.click(screen.getByText('Push success'));
    await user.click(screen.getByText('Push toast'));
    const messages = screen.getAllByText('Hello');
    expect(messages).toHaveLength(1);
  });

  it('throws when useToast is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestHarness />)).toThrow(
      'useToast must be used within a ToastProvider'
    );
    consoleSpy.mockRestore();
  });
});
