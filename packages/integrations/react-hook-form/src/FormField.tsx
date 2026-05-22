import { Field, Input } from '@ui-construction-library/core';
import type React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

// Local type mirror to avoid resolving stale .d.ts/.js from @ui-construction-library/core src
interface FieldWrapperProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  error?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

const FieldWrapper = Field as React.ForwardRefExoticComponent<
  FieldWrapperProps & React.RefAttributes<HTMLDivElement>
>;

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

  return (
    <FieldWrapper
      label={label}
      description={description}
      error={fieldState.error?.message}
    >
      <Input {...inputProps} {...field} />
    </FieldWrapper>
  );
}
