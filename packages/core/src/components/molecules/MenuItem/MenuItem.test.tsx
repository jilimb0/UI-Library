import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MenuItem } from './MenuItem';

describe('MenuItem component', () => {
  it('renders without crashing', () => {
    render(<MenuItem>Example</MenuItem>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MenuItem>Example</MenuItem>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
