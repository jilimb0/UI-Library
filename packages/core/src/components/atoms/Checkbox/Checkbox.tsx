import { CheckIcon } from '@ui-construction-library/icons';
import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      errorMessage,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const id = useId();
    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;

    return (
      <div className="control-field">
        <div style={{ position: 'relative' }}>
          <input
            id={id}
            aria-labelledby={labelId}
            type="checkbox"
            ref={ref}
            className={cn(
              'checkbox-box',
              {
                'checkbox-box--sm': size === 'sm',
                'checkbox-box--lg': size === 'lg',
              },
              error && 'input--error',
              className
            )}
            aria-describedby={
              description || (error && errorMessage) ? descriptionId : undefined
            }
            {...props}
          />

          <CheckIcon
            width={size === 'sm' ? 12 : size === 'md' ? 16 : 20}
            height={size === 'sm' ? 12 : size === 'md' ? 16 : 20}
            preserveAspectRatio="xMidYMid meet"
          />
        </div>

        {(label || description || (error && errorMessage)) && (
          <div className="control-stack">
            {label ? (
              <label htmlFor={id} id={labelId} className="field-label">
                {label}
              </label>
            ) : null}
            {description ? (
              <p id={descriptionId} className="field-hint">
                {description}
              </p>
            ) : null}
            {error && errorMessage ? (
              <p
                className="field-hint"
                style={{ color: 'var(--error)' }}
                aria-live="polite"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
