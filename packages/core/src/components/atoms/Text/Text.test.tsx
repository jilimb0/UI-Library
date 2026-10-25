import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders without crashing', () => {
    render(<Text>Example</Text>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('supports asChild pattern', () => {
    render(
      <Text asChild size="sm">
        <span data-testid="text-child">Inline text</span>
      </Text>
    );
    const el = screen.getByTestId('text-child');
    expect(el).toHaveClass('text--sm');
    expect(el.tagName).toBe('SPAN');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Text>Example</Text>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
