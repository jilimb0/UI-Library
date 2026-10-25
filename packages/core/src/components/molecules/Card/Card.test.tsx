import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card>Example</Card>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('supports asChild pattern', () => {
    render(
      <Card asChild elevation="raised">
        <a href="/cards/1" data-testid="card-child">
          Card Link
        </a>
      </Card>
    );
    const el = screen.getByTestId('card-child');
    expect(el).toHaveClass('card--raised');
    expect(el.tagName).toBe('A');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Card>Example</Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
