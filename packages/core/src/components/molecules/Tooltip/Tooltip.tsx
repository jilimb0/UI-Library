
import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative group inline-block', className)} {...props}>
        {children}
        <div className="absolute bottom-full mb-2 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
          {content}
        </div>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
