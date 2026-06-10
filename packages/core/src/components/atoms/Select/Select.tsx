import { ChevronDownIcon } from '@ui-construction-library/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ChangeEvent,
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
  useId,
} from 'react';
import { cn } from '../../../utils/cn';

export const selectVariants = cva('select', {
  variants: {
    size: {
      default: '',
      sm: 'select--sm',
      lg: 'select--lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type Option = { value: string; label: string };

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  description?: string;
  options?: Option[];
  error?: boolean;
  errorMessage?: string;
  /** Custom icon rendered as the dropdown arrow. Defaults to ChevronDownIcon. */
  icon?: ReactNode;
}

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
      ...props
    },
    ref
  ) => {
    const internalId = useId();
    const selectId = id ?? internalId;
    const labelId = `${selectId}-label`;
    const descriptionId = `${selectId}-description`;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
    };

    return (
      <div className="form-stack" style={{ gap: '0.25rem' }}>
        {label && (
          <label id={labelId} htmlFor={selectId} className="field-label">
            {label}
          </label>
        )}
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            id={selectId}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={
              description || (error && errorMessage) ? descriptionId : undefined
            }
            className={cn(
              selectVariants({ size, className }),
              error && 'select--error'
            )}
            ref={ref}
            onChange={handleChange}
            data-size={size}
            data-error={error || undefined}
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
          <p id={descriptionId} className="field-hint">
            {error && errorMessage ? errorMessage : description}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
