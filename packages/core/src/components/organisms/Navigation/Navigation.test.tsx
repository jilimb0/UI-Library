import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Navigation } from './Navigation';

describe('Navigation component', () => {
  it('renders without crashing', () => {
    render(<Navigation>Example</Navigation>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Navigation>Example</Navigation>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
