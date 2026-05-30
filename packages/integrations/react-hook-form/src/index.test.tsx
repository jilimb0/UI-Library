import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';

function Harness() {
  const methods = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  return (
    <FormProvider {...methods}>
      <FormField name="email" control={methods.control} label="Email" />
    </FormProvider>
  );
}

describe('integration-react-hook-form', () => {
  it('renders a controlled form field', () => {
    render(<Harness />);

    expect(screen.getByLabelText('Email')).toBeTruthy();
  });
});
