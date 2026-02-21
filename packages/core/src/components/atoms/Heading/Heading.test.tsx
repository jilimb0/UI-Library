import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Heading } from './Heading';
import { axe } from 'jest-axe';

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
