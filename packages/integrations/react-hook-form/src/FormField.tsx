import { Input, type InputProps } from '@ui-construction-library/core';
import type React from 'react';
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
  disabled,
  ...inputProps
}: FormFieldProps<T>) {
  const { field, fieldState } = useController({ name, control });

  const labelText = typeof label === 'string' ? label : undefined;
  const descriptionText =
    typeof description === 'string' ? description : undefined;

  const inputRef = field.ref as React.Ref<HTMLInputElement>;

  return (
    <div className="form-stack" style={{ gap: '0.25rem' }}>
      <Input
        {...(inputProps as Omit<InputProps, 'ref'>)}
        ref={inputRef}
        name={field.name}
        value={field.value as string | undefined}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={field.disabled ?? disabled}
        variant={fieldState.error ? 'error' : undefined}
        label={labelText}
        description={descriptionText}
      />
      {fieldState.error?.message ? (
        <p
          className="text--xs"
          style={{ color: 'var(--error, #ef4444)', marginTop: '0.25rem' }}
          role="alert"
        >
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  );
}
