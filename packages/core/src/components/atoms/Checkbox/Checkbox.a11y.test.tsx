import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Checkbox Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with role checkbox', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('has aria-checked true when checked', () => {
    render(<Checkbox label="Accept terms" checked={true} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('has aria-checked false when unchecked', () => {
    render(<Checkbox label="Accept terms" checked={false} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('has aria-checked mixed when indeterminate', () => {
    render(<Checkbox label="Select all" indeterminate />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });

  it('supports keyboard activation via Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<Checkbox label="Toggle" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');

    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard('{Space}');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('has aria-disabled when disabled', () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('associates label with checkbox via htmlFor', () => {
    render(<Checkbox label="Subscribe" id="sub" />);
    const label = screen.getByText('Subscribe');
    expect(label).toHaveAttribute('for', 'sub');
  });

  it('links error message via aria-describedby when error is present', () => {
    render(
      <Checkbox label="Required" error errorMessage="You must accept this" />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-describedby');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });
});
