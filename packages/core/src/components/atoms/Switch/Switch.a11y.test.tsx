import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Switch Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Switch label="Toggle feature" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with role switch', () => {
    render(<Switch label="Airplane mode" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('has aria-checked when checked', () => {
    render(<Switch label="Airplane mode" checked={true} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('has aria-checked false when unchecked', () => {
    render(<Switch label="Airplane mode" checked={false} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('supports keyboard activation via Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<Switch label="Toggle" onCheckedChange={onCheckedChange} />);
    const switchEl = screen.getByRole('switch');

    await user.tab();
    expect(switchEl).toHaveFocus();

    await user.keyboard('{Space}');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('has aria-disabled when disabled', () => {
    render(<Switch label="Disabled" disabled />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
  });

  it('associates label with switch via htmlFor', () => {
    render(<Switch label="Wi-Fi" id="wifi-switch" />);
    const label = screen.getByText('Wi-Fi');
    expect(label).toHaveAttribute('for', 'wifi-switch');
  });
});
