import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';


describe('Alert component', () => {
  it('renders without crashing', () => {
    render(<Alert>Example</Alert>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Alert>Example</Alert>);
    const results = await axe(container);
  });
});
