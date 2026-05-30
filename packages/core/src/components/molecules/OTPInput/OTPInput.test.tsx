import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OTPInput } from './OTPInput';

describe('OTPInput', () => {
  it('renders the requested number of slots', () => {
    render(<OTPInput length={4} defaultValue="12" />);

    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    expect(screen.getAllByDisplayValue('1')).toHaveLength(1);
    expect(screen.getAllByDisplayValue('2')).toHaveLength(1);
  });

  it('moves focus and emits digit changes', () => {
    const onValueChange = vi.fn();
    render(<OTPInput length={4} onValueChange={onValueChange} />);

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: '7' } });

    expect(onValueChange).toHaveBeenCalledWith('7');
    expect(document.activeElement).toBe(inputs[1]);
  });
});
