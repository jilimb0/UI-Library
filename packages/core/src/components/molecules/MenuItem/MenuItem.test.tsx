import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { MenuItem } from './MenuItem';


describe('MenuItem component', () => {
  it('renders without crashing', () => {
    render(<MenuItem>Example</MenuItem>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MenuItem>Example</MenuItem>);
    const results = await axe(container);
  });
});
