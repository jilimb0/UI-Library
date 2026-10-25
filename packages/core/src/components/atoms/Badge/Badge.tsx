import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
import { Slot } from '../../../utils/slot';
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
    BadgeVariants {
  /** Render as a child element (Slot pattern — merges props onto child). */
  asChild?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, style, asChild = false, ...props }, ref) => {
    const badgeClass = cn(badgeVariants({ variant, className }));

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={badgeClass}
          style={style}
          data-variant={variant}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        />
      );
    }

    return (
      <span
        ref={ref}
        className={badgeClass}
        style={style}
        data-variant={variant}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
