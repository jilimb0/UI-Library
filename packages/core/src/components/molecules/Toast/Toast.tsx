import { forwardRef, type HTMLAttributes, useCallback, useEffect } from 'react';
import { cn } from '../../../utils/cn';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** Auto-dismiss duration in ms. Set to `0` to disable auto-dismiss. */
  duration?: number;
  /** Visual variant matching semantic intent. */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Callback invoked when the toast should be dismissed. */
  onClose?: () => void;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      duration = 3000,
      variant = 'default',
      className,
      children,
      onClose,
      ...props
    },
    ref
  ) => {
    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    useEffect(() => {
      if (duration <= 0) return;
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }, [duration, handleClose]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          'toast',
          variant !== 'default' && `toast--${variant}`,
          className
        )}
        {...props}
      >
        <div className="toast__body">{children}</div>
        {onClose && (
          <button
            type="button"
            className="toast__close"
            aria-label="Dismiss"
            onClick={handleClose}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
