import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Link } from './Link';


describe('Link', () => {
  it('renders without crashing', () => {
    render(<Link>Example</Link>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Link>Example</Link>);
    const results = await axe(container);
  });
});
