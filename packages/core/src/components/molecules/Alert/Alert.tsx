import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const alertVariants = {
  default: 'alert--default',
  success: 'alert--success',
  warning: 'alert--warning',
  error: 'alert--error',
  info: 'alert--info',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('alert', alertVariants[variant], className)}
        style={style}
        {...props}
      />
    );
  }
);

Alert.displayName = 'Alert';
