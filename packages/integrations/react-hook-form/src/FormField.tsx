import { Input } from '@ui-construction-library/core';
import type { ReactNode } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  // Use controller-derived control type to reduce cross-package type identity conflicts
  // when multiple react-hook-form instances exist in a monorepo graph.
  control: UseControllerProps<T>['control'] | Control<T>;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
};

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  ...inputProps
}: FormFieldProps<T>) {
  const { field, fieldState } = useController({ name, control });

  const labelText = typeof label === 'string' ? label : undefined;
  const descriptionText =
    typeof description === 'string' ? description : undefined;

  return (
    <div className="flex flex-col space-y-1">
      <Input
        label={labelText}
        description={descriptionText}
        variant={fieldState.error ? 'error' : undefined}
        {...inputProps}
        {...field}
      />
      {fieldState.error?.message ? (
        <p className="text-xs text-red-600" role="alert">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  );
}
