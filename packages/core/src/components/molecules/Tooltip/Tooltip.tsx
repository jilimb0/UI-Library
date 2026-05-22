import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string | undefined;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('tooltip-trigger', className)}
        data-tooltip-trigger
        {...props}
      >
        {children}
        <div className="tooltip-bubble" role="tooltip">
          {content}
        </div>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
