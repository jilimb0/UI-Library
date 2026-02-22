import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-busy="true"
      className={cn('animate-pulse rounded-md bg-slate-200', className)}
      {...props}
    />
  );
}
