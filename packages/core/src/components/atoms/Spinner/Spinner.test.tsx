import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';


describe('Spinner component', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
  });
});
