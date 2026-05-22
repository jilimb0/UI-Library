import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '../../../utils/cn';

const inputVariants = cva('input', {
  variants: {
    size: {
      default: '',
      sm: 'input--sm',
      lg: 'input--lg',
    },
    variant: {
      default: '',
      error: 'input--error',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      variant,
      label,
      description,
      id,
      ...props
    },
    ref
  ) => {
    const uid = useId();
    const inputId = id ?? `input-${uid}`;
    const labelId = label ? `${inputId}-label` : undefined;
    const descriptionId = description ? `${inputId}-description` : undefined;

    return (
      <div>
        {label && (
          <label id={labelId} htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(inputVariants({ size, variant }), className)}
          ref={ref}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          {...props}
        />
        {description && (
          <div id={descriptionId} className="field-hint">
            {description}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
