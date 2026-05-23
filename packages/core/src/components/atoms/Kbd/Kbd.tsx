import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn('kbd', className)}
        style={style}
        {...props}
      />
    );
  }
);

Kbd.displayName = 'Kbd';

export { Kbd };
