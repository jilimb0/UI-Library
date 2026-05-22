import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

const tagVariants = cva('tag', {
  variants: {
    variant: {
      neutral: '',
      primary: 'badge--default',
      success: 'badge--success',
      warning: 'badge--warning',
      error: 'badge--error',
    },
    size: {
      sm: 'tag--sm',
      md: '',
      lg: 'tag--lg',
    },
  },
  defaultVariants: {
    variant: 'neutral',
    size: 'md',
  },
});

export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  icon?: ReactNode;
  onRemove?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  removeLabel?: string;
}

export function Tag({
  className,
  variant,
  size,
  children,
  icon,
  onRemove,
  removeLabel = 'Remove',
  ...props
}: TagProps) {
  return (
    <span className={cn(tagVariants({ variant, size }), className)} {...props}>
      {icon ? <span className="inline-flex">{icon}</span> : null}
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="button button--ghost button--icon"
          style={{ minHeight: '1rem', width: '1rem', padding: 0 }}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
