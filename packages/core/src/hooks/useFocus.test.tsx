import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFocus } from './useFocus';

const TestComponent = () => {
  const ref = useFocus<HTMLInputElement>();
  return (
    <input ref={ref as React.Ref<HTMLInputElement>} data-testid="test-input" />
  );
};

describe('useFocus', () => {
  it('focuses the referenced element on mount', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test-input')).toHaveFocus();
  });
});
