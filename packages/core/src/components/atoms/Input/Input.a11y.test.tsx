import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Input Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Input label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with role textbox', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input label="Email" id="email" />);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('has aria-describedby when description is present', () => {
    render(
      <Input label="Email" description="We will never share your email" />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('has aria-invalid and aria-describedby when error is present', () => {
    render(<Input label="Email" error errorMessage="Invalid email address" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('supports keyboard focus', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    const input = screen.getByRole('textbox');

    await user.tab();
    expect(input).toHaveFocus();
  });

  it('has aria-required when required', () => {
    render(<Input label="Required" required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });
});
