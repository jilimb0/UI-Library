import { forwardRef, type InputHTMLAttributes, useId, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface FloatingLabelInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  /** Floating label text. */
  label: string;
  /** Error message. When set, input shows error state. */
  error?: string;
  /** Hint text displayed below the input. */
  hint?: string;
}

export const FloatingLabelInput = forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      label,
      error,
      hint,
      className,
      id: externalId,
      value,
      defaultValue,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      value !== undefined
        ? String(value).length > 0
        : defaultValue !== undefined
    );

    const isFloating = focused || hasValue;

    return (
      <div className={cn('floating-label-input', className)}>
        <div
          className={cn(
            'floating-label-input__wrapper',
            error && 'floating-label-input__wrapper--error'
          )}
        >
          <input
            ref={ref}
            id={id}
            className="floating-label-input__field"
            value={value}
            defaultValue={defaultValue}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              'floating-label-input__label',
              isFloating && 'floating-label-input__label--float'
            )}
          >
            {label}
          </label>
        </div>
        {error ? (
          <p className="floating-label-input__error" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="floating-label-input__hint">{hint}</p>
        ) : null}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';
