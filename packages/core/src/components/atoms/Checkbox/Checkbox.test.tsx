import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Test checkbox" />);
    expect(screen.getByLabelText('Test checkbox')).toBeInTheDocument();
  });

  it('handles checked state', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox label="Test" onChange={onChange} />);

    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('displays error message', () => {
    render(<Checkbox label="Test" error errorMessage="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('supports all sizes', () => {
    const { rerender } = render(<Checkbox size="sm" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-4', 'w-4');

    rerender(<Checkbox size="md" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-5', 'w-5');

    rerender(<Checkbox size="lg" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-6', 'w-6');
  });

  it('is accessible', async () => {
    const { container } = render(<Checkbox label="Accessible checkbox" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
