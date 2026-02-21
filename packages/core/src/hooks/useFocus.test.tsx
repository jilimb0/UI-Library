import { describe, it, expect } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';
import { useFocus } from './useFocus';

const TestComponent = () => {
  const ref = useFocus<HTMLInputElement>();
  return <input ref={ref} data-testid="test-input" />;
};

describe('useFocus', () => {
  it("should log 'Element focused' on focus", () => {
    const spy = jest.spyOn(console, 'log');
    render(<TestComponent />);
    fireEvent.focus(screen.getByTestId('test-input'));
    expect(spy).toHaveBeenCalledWith('Element focused');
    spy.mockRestore();
  });
});
