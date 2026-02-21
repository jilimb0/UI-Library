import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Link } from './Link';
import { axe } from 'jest-axe';

describe('Link', () => {
  it('renders without crashing', () => {
    render(<Link>Example</Link>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Link>Example</Link>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
