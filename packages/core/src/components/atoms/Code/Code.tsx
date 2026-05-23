import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

const Code = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return <code ref={ref} className={cn('code', className)} {...props} />;
  }
);

Code.displayName = 'Code';

export { Code };
