import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';
import { axe } from 'jest-axe';

describe('Avatar component', () => {
  it('renders without crashing', () => {
    render(<Avatar />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Avatar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
