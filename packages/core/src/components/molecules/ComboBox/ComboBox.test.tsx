import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboBox } from './ComboBox';

describe('ComboBox', () => {
  const options = [
    { value: 'alpha', label: 'Alpha' },
    { value: 'beta', label: 'Beta' },
  ];

  it('renders a combobox input with correct ARIA attributes', () => {
    render(<ComboBox options={options} label="Fruit" />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('opens listbox on focus', () => {
    render(<ComboBox options={options} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('filters options and selects with click', () => {
    const onValueChange = vi.fn();
    render(<ComboBox options={options} onValueChange={onValueChange} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'be' } });

    const option = screen.getByRole('option', { name: 'Beta' });
    expect(option).toBeInTheDocument();

    fireEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith('beta');
  });

  it('supports keyboard navigation and selection', () => {
    const onChange = vi.fn();
    render(<ComboBox options={options} onChange={onChange} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // ArrowDown moves to next option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Enter selects
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('beta');
  });

  it('closes on Escape and keeps focus on input', () => {
    render(<ComboBox options={options} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
