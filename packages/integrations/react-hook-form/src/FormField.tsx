import { Input } from '@ui-construction-library/core';
import type React from 'react';
import type { ReactNode } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

// Cast Input to a plain FC signature so TypeScript resolves props directly
// from InputHTMLAttributes rather than through ForwardRefExoticComponent<T>.
// ForwardRefExoticComponent with @types/react@18.3 loses the prop types when
// used via ComponentPropsWithRef in certain monorepo resolution scenarios where
// dist/index.d.ts and dist/src/index.d.ts coexist.
const InputField = Input as unknown as (
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    ref?: React.Ref<HTMLInputElement>;
    variant?: 'default' | 'error';
    label?: string;
    description?: string;
    size?: 'default' | 'sm' | 'lg';
  }
) => React.ReactElement | null;

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

  return (
    <div className="form-stack" style={{ gap: '0.25rem' }}>
      <InputField
        ref={field.ref}
        name={field.name}
        value={field.value as string | undefined}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={field.disabled ?? disabled}
        variant={fieldState.error ? 'error' : undefined}
        label={labelText}
        description={descriptionText}
        placeholder={inputProps.placeholder}
        className={inputProps.className}
        size={inputProps.size}
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
