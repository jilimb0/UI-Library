import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { axe } from 'jest-axe';

describe('Field component', () => {
  it('renders without crashing', () => {
    render(<Field>Example</Field>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Field>Example</Field>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
