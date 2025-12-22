
import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const alertVariants = {
  default: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ variant = 'default', className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('rounded-md p-4', alertVariants[variant], className)} {...props} />
  );
});

Alert.displayName = 'Alert';


