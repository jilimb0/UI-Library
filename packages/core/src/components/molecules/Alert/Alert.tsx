import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const alertVariants = {
  default: 'alert--default',
  success: 'alert--success',
  warning: 'alert--warning',
  error: 'alert--error',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('alert', alertVariants[variant], className)}
        {...props}
      />
    );
  }
);

Alert.displayName = 'Alert';
