import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders a horizontal divider by default', () => {
    render(<Divider />);

    const divider = screen.getByRole('separator');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider).toHaveClass('divider');
  });

  it('renders a labeled divider as a presentational cluster', () => {
    render(<Divider label="or continue with" />);

    expect(screen.getByText('or continue with')).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toHaveClass('inline-cluster');
  });

  it('renders a vertical divider when requested', () => {
    render(<Divider orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );
  });
});
