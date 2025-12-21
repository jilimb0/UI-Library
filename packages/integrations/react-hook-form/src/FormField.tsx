
import { useController } from 'react-hook-form';
import { Field } from '@ui/core';

export const FormField = ({ name, control, ...props }) => {
  const { field, fieldState } = useController({ name, control });

  return (
    <Field
      {...field}
      {...props}
      error={!!fieldState.error}
      errorMessage={fieldState.error?.message}
    />
  );
};
