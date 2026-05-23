import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return <kbd ref={ref} className={cn('kbd', className)} {...props} />;
  }
);

Kbd.displayName = 'Kbd';

export { Kbd };
