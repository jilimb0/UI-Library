import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Field } from './Field';


describe('Field component', () => {
  it('renders without crashing', () => {
    render(<Field>Example</Field>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Field>Example</Field>);
    const results = await axe(container);
  });
});
