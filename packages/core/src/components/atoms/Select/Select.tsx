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
      <div className="flex flex-col space-y-1">
        {label && (
          <label id={labelId} htmlFor={selectId} className="field-label">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={
              description || (error && errorMessage) ? descriptionId : undefined
            }
            className={cn(selectVariants({ size, className }))}
            ref={ref}
            onChange={handleChange}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
            {icon ?? <ChevronDownIcon className="h-4 w-4" />}
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
