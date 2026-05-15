import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading component', () => {
  it('renders without crashing', () => {
    render(<Heading>Example</Heading>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Heading>Example</Heading>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
