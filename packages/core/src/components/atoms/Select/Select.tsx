import { ChevronDownIcon } from '@ui-construction-library/icons';
import {
  type ChangeEvent,
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
  useId,
} from 'react';
import { cn } from '../../../utils/cn';

type Option = { value: string; label: string };

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  description?: string;
  options?: Option[];
  error?: boolean;
  errorMessage?: string;
  /** Custom icon rendered as the dropdown arrow. Defaults to ChevronDownIcon. */
  icon?: ReactNode;
}

/**
 * Select dropdown component with label, options, error state, and custom icon support.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Select label="Size" size="sm" error errorMessage="Please select a size">
 *   <option value="sm">Small</option>
 *   <option value="md">Medium</option>
 * </Select>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size,
      label,
      description,
      options,
      error,
      errorMessage,
      className,
      id,
      onChange,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const internalId = useId();
    const selectId = id ?? internalId;
    const labelId = `${selectId}-label`;
    const descriptionId = `${selectId}-description`;
    const errorId = error && errorMessage ? `${selectId}-error` : undefined;

    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
    };

    return (
      <div className="ucl-form-stack" style={{ gap: '0.25rem' }}>
        {label && (
          <label id={labelId} htmlFor={selectId} className="ucl-field-label">
            {label}
          </label>
        )}
        <div
          className={cn('ucl-select-wrapper', className)}
          style={{ position: 'relative', width: '100%' }}
        >
          <select
            id={selectId}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={describedBy}
            aria-invalid={error || undefined}
            className={cn(
              'ucl-select',
              size === 'sm' && 'ucl-select--sm',
              size === 'lg' && 'ucl-select--lg',
              error && 'ucl-select--error'
            )}
            ref={ref}
            onChange={handleChange}
            data-size={size}
            data-error={error || undefined}
            disabled={disabled}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none text-muted-foreground"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon ?? (
              <ChevronDownIcon style={{ width: '1rem', height: '1rem' }} />
            )}
          </span>
        </div>
        {(description || (error && errorMessage)) && (
          <p id={describedBy} className="ucl-field-hint">
            {error && errorMessage ? errorMessage : description}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
