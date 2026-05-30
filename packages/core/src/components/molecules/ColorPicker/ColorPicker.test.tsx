import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders the initial color and rgb preview', () => {
    render(<ColorPicker value="#ff0000" />);

    expect(screen.getAllByDisplayValue('#ff0000')).toHaveLength(2);
    expect(screen.getByText('rgb(255, 0, 0)')).toBeInTheDocument();
  });

  it('emits changes from both inputs', () => {
    const onValueChange = vi.fn();
    render(<ColorPicker onValueChange={onValueChange} />);

    fireEvent.change(screen.getAllByDisplayValue('#3b82f6')[1], {
      target: { value: '#00ff00' },
    });

    expect(onValueChange).toHaveBeenCalledWith('#00ff00');
    expect(screen.getByText('rgb(0, 255, 0)')).toBeInTheDocument();
  });
});
