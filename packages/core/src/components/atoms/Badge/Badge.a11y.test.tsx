import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Badge Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>New</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with role status for non-interactive badge', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('has aria-label when provided', () => {
    render(<Badge aria-label="3 unread messages">3</Badge>);
    expect(screen.getByLabelText('3 unread messages')).toBeInTheDocument();
  });
});
