import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TestComponent from './TestComponent';

describe('useClickOutside', () => {
  it('should call callback on outside click', () => {
    const callback = vi.fn();

    render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(document.body);

    expect(callback).toHaveBeenCalled();
  });

  it('should not call callback on inside click', () => {
    const callback = vi.fn();

    render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(screen.getByTestId('test-div'));

    expect(callback).not.toHaveBeenCalled();
  });
});
