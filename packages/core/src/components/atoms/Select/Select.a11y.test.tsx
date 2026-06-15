import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Select Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Select
        label="Country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders as combobox', () => {
    render(
      <Select
        label="Country"
        options={[{ value: 'us', label: 'United States' }]}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('associates label with select via htmlFor', () => {
    render(
      <Select
        label="Country"
        id="country"
        options={[{ value: 'us', label: 'United States' }]}
      />
    );
    const label = screen.getByText('Country');
    expect(label).toHaveAttribute('for', 'country');
  });

  it('has aria-describedby when description is present', () => {
    render(
      <Select
        label="Country"
        description="Choose your country of residence"
        options={[{ value: 'us', label: 'United States' }]}
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-describedby');
  });

  it('has aria-invalid when error is present', () => {
    render(
      <Select
        label="Country"
        error
        errorMessage="Please select a country"
        options={[{ value: 'us', label: 'United States' }]}
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports keyboard focus', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Country"
        options={[{ value: 'us', label: 'United States' }]}
      />
    );
    const select = screen.getByRole('combobox');
    await user.tab();
    expect(select).toHaveFocus();
  });
});
