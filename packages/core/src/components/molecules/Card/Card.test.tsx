import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { axe } from 'jest-axe';

describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card>Example</Card>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Card>Example</Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
