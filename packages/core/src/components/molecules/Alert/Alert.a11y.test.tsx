import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from './Alert';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Alert Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Alert>Action completed successfully</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with role alert', () => {
    render(<Alert role="alert">Action completed</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has aria-live polite for non-critical alerts', () => {
    render(<Alert aria-live="polite">Update available</Alert>);
    expect(screen.getByText('Update available')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  });
});
