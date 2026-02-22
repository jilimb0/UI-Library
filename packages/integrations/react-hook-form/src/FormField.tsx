import type { ComponentProps } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Field, Input } from '@ui-lib/core';

type InputProps = ComponentProps<typeof Input>;

export type FormFieldProps<T extends FieldValues> = Omit<InputProps, 'onChange' | 'value'> & {
  name: Path<T>;
  control: Control<T>;
  label?: ComponentProps<typeof Field>['label'];
  description?: ComponentProps<typeof Field>['description'];
};

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  ...inputProps
}: FormFieldProps<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <Field
      label={label}
      description={description}
      error={fieldState.error?.message}
    >
      <Input {...inputProps} {...field} />
    </Field>
  );
}
