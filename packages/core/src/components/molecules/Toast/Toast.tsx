
import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ duration = 3000, className, children, onAnimationEnd, ...props }, ref) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        onAnimationEnd?.({} as any);
      }, duration);
      return () => clearTimeout(timer);
    }, [duration, onAnimationEnd]);

    return (
      <div ref={ref} className={cn('rounded-md bg-gray-800 p-3 text-white shadow-md', className)} {...props}>
        {children}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
