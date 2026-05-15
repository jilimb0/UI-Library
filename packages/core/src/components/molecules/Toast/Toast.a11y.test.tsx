import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Toast } from './Toast';

describe('Toast Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Toast>Accessible toast</Toast>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is announced to screen readers', () => {
    render(<Toast role="status">Announcement</Toast>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
