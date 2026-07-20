import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast>Hello</Toast>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Toast variant="success">Success</Toast>);
    expect(screen.getByText('Success').parentElement).toHaveClass(
      'toast--success'
    );
  });

  it('renders close button when onClose is provided', () => {
    render(<Toast onClose={() => {}}>Dismissible</Toast>);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('does not render close button without onClose', () => {
    render(<Toast>No close</Toast>);
    expect(
      screen.queryByRole('button', { name: 'Dismiss' })
    ).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast onClose={onClose}>Click close</Toast>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto dismisses after duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(
      <Toast duration={3000} onClose={onClose}>
        Auto dismiss
      </Toast>
    );
    vi.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('does not auto dismiss when duration is 0', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(
      <Toast duration={0} onClose={onClose}>
        Persistent
      </Toast>
    );
    vi.advanceTimersByTime(5000);
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Toast ref={ref}>Ref test</Toast>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
