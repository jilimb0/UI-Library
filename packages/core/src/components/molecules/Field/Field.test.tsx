import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Input } from '../../atoms/Input/Input';
import { Field } from './Field';

describe('Field component', () => {
  it('renders without crashing', () => {
    render(
      <Field label="Name">
        <Input placeholder="Jane Doe" />
      </Field>
    );
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Field label="Name" description="Your display name">
        <Input placeholder="Jane Doe" />
      </Field>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports plain text children', () => {
    render(<Field>Example</Field>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });
});
