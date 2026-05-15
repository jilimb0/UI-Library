import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar component', () => {
  it('renders without crashing', () => {
    render(<Avatar alt="User avatar" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Avatar alt="User avatar" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
