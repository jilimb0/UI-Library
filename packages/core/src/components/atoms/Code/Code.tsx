import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export function Code({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <code className={cn('code', className)} {...props} />;
}
