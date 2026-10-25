import { forwardRef, type HTMLAttributes, useCallback, useEffect } from 'react';
import { cn, tv, type VariantProps } from '../../../utils/cn';

const toastVariants = tv({
  slots: {
    root: 'toast',
    body: 'toast__body',
    close: 'toast__close',
  },
  variants: {
    variant: {
      default: { root: '' },
      success: { root: 'toast--success' },
      warning: { root: 'toast--warning' },
      error: { root: 'toast--error' },
      info: { root: 'toast--info' },
    },
  },
  defaultVariants: { variant: 'default' },
});

type ToastVariants = VariantProps<typeof toastVariants>;

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    ToastVariants {
  /** Auto-dismiss duration in ms. Set to `0` to disable auto-dismiss. */
  duration?: number;
  /** Callback invoked when the toast should be dismissed. */
  onClose?: () => void;
  /** Override class names for individual slots. */
  classNames?: {
    root?: string;
    body?: string;
    close?: string;
  };
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      duration = 3000,
      variant = 'default',
      className,
      style,
      children,
      onClose,
      classNames: slotClassNames,
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

    const slots = toastVariants({ variant });

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(slots.root(), slotClassNames?.root, className)}
        style={style}
        {...props}
      >
        <div className={cn(slots.body(), slotClassNames?.body)}>{children}</div>
        {onClose && (
          <button
            type="button"
            className={cn(slots.close(), slotClassNames?.close)}
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

export { Toast, toastVariants };
