import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';
import '@testing-library/jest-dom';
import React from 'react';

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast>Hello</Toast>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('auto hides after duration callback', () => {
    jest.useFakeTimers();
    const onAnimationEnd = vi.fn();

    render(
      <Toast duration={3000} onAnimationEnd={onAnimationEnd}>
        Hide me
      </Toast>
    );

    jest.advanceTimersByTime(3000);
    expect(onAnimationEnd).toHaveBeenCalled();
  });
});
