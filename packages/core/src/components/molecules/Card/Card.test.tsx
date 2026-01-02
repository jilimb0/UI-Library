import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Card } from './Card';


describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card>Example</Card>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Card>Example</Card>);
    const results = await axe(container);
  });
});
