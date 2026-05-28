import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFocus } from './useFocus';

const TestComponent = () => {
  const ref = useFocus<HTMLInputElement>();
  return (
    <input ref={ref as React.Ref<HTMLInputElement>} data-testid="test-input" />
  );
};

describe('useFocus', () => {
  it("should log 'Element focused' on focus", () => {
    const spy = vi.spyOn(console, 'log');
    render(<TestComponent />);
    fireEvent.focus(screen.getByTestId('test-input'));
    expect(spy).toHaveBeenCalledWith('Element focused');
    spy.mockRestore();
  });
});
