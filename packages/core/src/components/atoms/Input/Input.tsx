import { createFieldBehavior } from '@ui-construction-library/behaviors';
import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
  suffix?: React.ReactNode;
}

/**
 * Text input component with label, description, error state, and accessibility support.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Full name"
 *   error
 *   errorMessage="Name is required"
 *   size="sm"
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      label,
      description,
      error,
      errorMessage,
      id,
      style,
      disabled,
      required,
      suffix,
      ...props
    },
    ref
  ) => {
    const uid = useId();
    const inputId = id ?? `input-${uid}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error && errorMessage ? `${inputId}-error` : undefined;

    const {
      labelAttrs,
      labelClassName,
      inputAttrs,
      inputClassName,
      errorAttrs,
      errorClassName,
    } = createFieldBehavior({
      fieldId: inputId,
      descriptionId,
      errorId,
      hasError: error,
      disabled,
      required,
    });

    return (
      <div style={style}>
        {label && (
          <label {...labelAttrs} htmlFor={inputId} className={labelClassName}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          <input
            {...inputAttrs}
            aria-required={required || undefined}
            aria-describedby={error && errorMessage ? errorId : descriptionId}
            aria-invalid={error || undefined}
            id={inputId}
            type={type}
            className={cn(
              inputClassName,
              size === 'sm' && 'ucl-input--sm',
              size === 'lg' && 'ucl-input--lg',
              suffix && 'ucl-input--with-suffix',
              className
            )}
            ref={ref}
            style={suffix ? { paddingRight: '2.5rem' } : undefined}
            {...props}
          />
          {suffix && (
            <div
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'auto',
                lineHeight: 0,
              }}
            >
              {suffix}
            </div>
          )}
        </div>
        {description && !error && (
          <div id={descriptionId} className="ucl-field-hint">
            {description}
          </div>
        )}
        {error && errorMessage && (
          <div {...errorAttrs} className={errorClassName} aria-live="polite">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
