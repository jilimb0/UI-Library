import { describe, it, expect, vi } from "vitest";

import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';
import '@testing-library/jest-dom';
import React from 'react';


describe('Navigation component', () => {
  it('renders without crashing', () => {
    render(<Navigation>Example</Navigation>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Navigation>Example</Navigation>);
    const results = await axe(container);
  });
});
