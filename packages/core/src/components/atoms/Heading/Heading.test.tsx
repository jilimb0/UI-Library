import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading component', () => {
  it('renders without crashing', () => {
    render(<Heading>Example</Heading>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('supports asChild pattern', () => {
    render(
      <Heading asChild className="custom-title">
        <h2 data-testid="heading-child">Subhead</h2>
      </Heading>
    );
    const el = screen.getByTestId('heading-child');
    expect(el).toHaveClass('custom-title');
    expect(el.tagName).toBe('H2');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Heading>Example</Heading>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
