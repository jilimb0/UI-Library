import { forwardRef, type HTMLAttributes } from 'react';
import { cn, tv, type VariantProps } from '../../../utils/cn';

const alertVariants = tv({
  base: 'alert',
  variants: {
    variant: {
      default: 'alert--default',
      success: 'alert--success',
      warning: 'alert--warning',
      error: 'alert--error',
      info: 'alert--info',
    },
  },
  defaultVariants: { variant: 'default' },
});

type AlertVariants = VariantProps<typeof alertVariants>;

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    AlertVariants {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        style={style}
        {...props}
      />
    );
  }
);

Alert.displayName = 'Alert';

export { alertVariants };
