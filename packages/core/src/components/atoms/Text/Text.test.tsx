import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Text } from './Text';


describe('Text', () => {
  it('renders without crashing', () => {
    render(<Text>Example</Text>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Text>Example</Text>);
    const results = await axe(container);
  });
});
