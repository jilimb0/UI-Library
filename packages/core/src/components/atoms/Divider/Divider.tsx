import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

const Divider = forwardRef<HTMLElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <hr
          ref={ref as React.Ref<HTMLHRElement>}
          aria-orientation="vertical"
          className={cn('divider', className)}
          style={{ width: '1px', height: '100%', minHeight: '1rem' }}
          {...(props as HTMLAttributes<HTMLHRElement>)}
        />
      );
    }

    if (!label) {
      return (
        <hr
          ref={ref as React.Ref<HTMLHRElement>}
          aria-orientation="horizontal"
          className={cn('divider', className)}
          {...(props as HTMLAttributes<HTMLHRElement>)}
        />
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="presentation"
        className={cn('inline-cluster', className)}
        style={{ width: '100%' }}
        {...props}
      >
        <hr className="divider" style={{ flex: 1 }} />
        <span className="field-hint" style={{ textTransform: 'uppercase' }}>
          {label}
        </span>
        <hr className="divider" style={{ flex: 1 }} />
      </div>
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
