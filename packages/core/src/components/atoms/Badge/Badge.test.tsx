import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { axe } from 'jest-axe';

describe('Badge', () => {
  it('renders without crashing', () => {
    render(<Badge>Example</Badge>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Example</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
