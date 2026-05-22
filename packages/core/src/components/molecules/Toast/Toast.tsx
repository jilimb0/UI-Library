import { forwardRef, type HTMLAttributes, useEffect } from 'react';
import { cn } from '../../../utils/cn';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ duration = 3000, className, children, onAnimationEnd, ...props }, ref) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onAnimationEnd?.({} as any);
      }, duration);
      return () => clearTimeout(timer);
    }, [duration, onAnimationEnd]);

    return (
      <div ref={ref} className={cn('toast', className)} {...props}>
        {children}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
