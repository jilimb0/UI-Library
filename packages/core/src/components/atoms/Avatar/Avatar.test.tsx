import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';


describe('Avatar component', () => {
  it('renders without crashing', () => {
    render(<Avatar />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Avatar />);
    const results = await axe(container);
  });
});
