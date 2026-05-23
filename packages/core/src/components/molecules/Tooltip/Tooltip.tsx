import { forwardRef, type HTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** The tooltip text or content. */
  content: ReactNode;
  /** Preferred side for the tooltip. Defaults to 'top'. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay in milliseconds before showing the tooltip. */
  delayMs?: number;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, side = 'top', delayMs, className, children, ...props }, ref) => {
    const tooltipId = useId();

    return (
      <div
        ref={ref}
        className={cn('tooltip-trigger', className)}
        aria-describedby={tooltipId}
        data-tooltip-trigger
        style={
          delayMs != null
            ? ({ '--tooltip-delay': `${delayMs}ms` } as React.CSSProperties)
            : undefined
        }
        {...props}
      >
        {children}
        <div
          id={tooltipId}
          className={cn('tooltip-bubble', `tooltip-bubble--${side}`)}
          role="tooltip"
        >
          {content}
        </div>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
export default Tooltip;
