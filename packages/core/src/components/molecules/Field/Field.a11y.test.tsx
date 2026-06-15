import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../../atoms/Input';
import { Field } from './Field';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Field Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Field label="Email">
        <Input id="email" />
      </Field>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('label is associated with input via htmlFor', () => {
    render(
      <Field label="Email">
        <Input id="email" />
      </Field>
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('shows error message with aria-live', () => {
    render(
      <Field label="Email" error="Required">
        <Input id="email" />
      </Field>
    );
    expect(screen.getByText('Required')).toHaveAttribute('aria-live', 'polite');
  });
});
