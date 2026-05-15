import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'border-slate-200 bg-slate-100 text-slate-800',
        primary: 'border-blue-200 bg-blue-100 text-blue-800',
        success: 'border-green-200 bg-green-100 text-green-800',
        warning: 'border-amber-200 bg-amber-100 text-amber-800',
        error: 'border-red-200 bg-red-100 text-red-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

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
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-current/80 hover:bg-black/10 hover:text-current"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
