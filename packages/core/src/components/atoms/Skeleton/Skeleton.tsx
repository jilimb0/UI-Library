import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-busy="true"
        className={cn('skeleton', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
