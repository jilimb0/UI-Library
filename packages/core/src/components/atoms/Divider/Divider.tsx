import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export function Divider({
  className,
  orientation = 'horizontal',
  label,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <hr
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
        aria-orientation="horizontal"
        className={cn('divider', className)}
        {...(props as HTMLAttributes<HTMLHRElement>)}
      />
    );
  }

  return (
    <div
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
