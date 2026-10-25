import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
import { tv, type VariantProps } from '../../../utils/variants';

const badgeVariants = tv({
  base: 'badge',
  variants: {
    variant: {
      default: 'badge--default',
      success: 'badge--success',
      warning: 'badge--warning',
      error: 'badge--error',
      info: 'badge--info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    BadgeVariants {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        style={style}
        data-variant={variant}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
