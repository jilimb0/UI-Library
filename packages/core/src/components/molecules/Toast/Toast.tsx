
import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ duration = 3000, className, children, ...props }, ref) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        // auto dismiss logic
      }, duration);
      return () => clearTimeout(timer);
    }, [duration]);

    return (
      <div ref={ref} className={cn('rounded-md bg-gray-800 p-3 text-white shadow-md', className)} {...props}>
        {children}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
