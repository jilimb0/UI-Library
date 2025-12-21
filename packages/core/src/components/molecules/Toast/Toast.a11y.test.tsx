
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Toast } from './Toast';

describe('Toast Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Toast message="Accessible toast" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is announced to screen readers', () => {
    render(<Toast message="Announcement" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
