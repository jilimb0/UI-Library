import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Field } from './Field';

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
