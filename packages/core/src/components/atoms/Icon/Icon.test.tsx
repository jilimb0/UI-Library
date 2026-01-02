import { describe, it, expect, vi } from "vitest";


import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';


describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon name="CheckIcon" />);
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Icon name="CheckIcon" />);
    const results = await axe(container);
  });
});
