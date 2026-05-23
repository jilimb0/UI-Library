import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
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
      default: '',
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
  /** @deprecated use size="default" */
  legacySize?: 'md';
  icon?: ReactNode;
  onRemove?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  removeLabel?: string;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant,
      size,
      legacySize,
      children,
      icon,
      onRemove,
      removeLabel = 'Remove',
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          tagVariants({
            variant,
            size: size ?? (legacySize === 'md' ? 'md' : undefined),
          }),
          className
        )}
        {...props}
      >
        {icon ? <span className="button__icon">{icon}</span> : null}
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
);

Tag.displayName = 'Tag';

export { Tag, tagVariants };
