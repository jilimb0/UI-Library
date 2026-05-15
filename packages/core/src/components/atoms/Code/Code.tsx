import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export function Code({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-900',
        className
      )}
      {...props}
    />
  );
}
