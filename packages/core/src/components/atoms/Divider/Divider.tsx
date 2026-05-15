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
        className={cn(
          'h-full min-h-4 w-px bg-slate-200 border-none',
          className
        )}
        {...(props as HTMLAttributes<HTMLHRElement>)}
      />
    );
  }

  if (!label) {
    return (
      <hr
        aria-orientation="horizontal"
        className={cn('h-px w-full bg-slate-200 border-none', className)}
        {...(props as HTMLAttributes<HTMLHRElement>)}
      />
    );
  }

  return (
    <div
      role="presentation"
      className={cn('flex w-full items-center gap-3 text-slate-500', className)}
      {...props}
    >
      <hr className="flex-1 border-none bg-slate-200 h-px" />
      <span className="text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <hr className="flex-1 border-none bg-slate-200 h-px" />
    </div>
  );
}
