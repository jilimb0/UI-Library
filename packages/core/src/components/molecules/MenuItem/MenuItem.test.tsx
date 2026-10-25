import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MenuItem } from './MenuItem';

describe('MenuItem component', () => {
  it('renders without crashing', () => {
    render(<MenuItem>Example</MenuItem>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('supports asChild pattern', () => {
    render(
      <MenuItem asChild active>
        <a href="/profile" data-testid="menu-item-child">
          Profile
        </a>
      </MenuItem>
    );
    const el = screen.getByTestId('menu-item-child');
    expect(el).toHaveClass('dropdown-menu__item--active');
    expect(el.tagName).toBe('A');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MenuItem>Example</MenuItem>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
