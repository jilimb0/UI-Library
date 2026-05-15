import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-xs text-slate-700 shadow-sm',
        className
      )}
      {...props}
    />
  );
}
