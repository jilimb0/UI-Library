import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';
import '@testing-library/jest-dom';

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast>Hello</Toast>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('auto hides after duration callback', () => {
    vi.useFakeTimers();
    const onAnimationEnd = vi.fn();

    render(
      <Toast duration={3000} onAnimationEnd={onAnimationEnd}>
        Hide me
      </Toast>
    );

    vi.advanceTimersByTime(3000);
    expect(onAnimationEnd).toHaveBeenCalled();
  });
});
