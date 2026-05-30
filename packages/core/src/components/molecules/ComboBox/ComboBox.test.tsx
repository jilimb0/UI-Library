import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboBox } from './ComboBox';

describe('ComboBox', () => {
  const options = [
    { value: 'alpha', label: 'Alpha' },
    { value: 'beta', label: 'Beta' },
  ];

  it('opens, filters, and selects an option', () => {
    const onValueChange = vi.fn();
    render(<ComboBox options={options} onValueChange={onValueChange} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'be' } });

    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('beta');
    expect(input).toHaveValue('');
  });

  it('supports keyboard selection', () => {
    const onChange = vi.fn();
    render(<ComboBox options={options} onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('beta');
  });
});
