import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Slider } from './Slider';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Slider Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Slider defaultValue={[50]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders thumb with role slider', () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('has aria-valuemin, aria-valuemax, and aria-valuenow', () => {
    render(<Slider defaultValue={[50]} min={0} max={100} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
  });

  it('has aria-label for thumb', () => {
    render(<Slider defaultValue={[50]} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-label');
  });

  it('supports keyboard focus', async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={[50]} />);
    const thumb = screen.getByRole('slider');
    await user.tab();
    expect(thumb).toHaveFocus();
  });
});
