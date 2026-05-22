import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cn('kbd', className)} {...props} />;
}
