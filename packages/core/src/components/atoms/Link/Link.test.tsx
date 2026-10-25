import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders without crashing', () => {
    render(<Link>Example</Link>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('supports asChild rendering child element with link classes', () => {
    render(
      <Link asChild>
        <span data-testid="custom-link">Router Link</span>
      </Link>
    );
    const el = screen.getByTestId('custom-link');
    expect(el).toHaveClass('link');
    expect(el.tagName).toBe('SPAN');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Link>Example</Link>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
