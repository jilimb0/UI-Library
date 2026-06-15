import { createTooltipBehavior } from '@ui-construction-library/behaviors';
import {
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from 'react';
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

const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  ({ content, side = 'top', delayMs, className, children, ...props }, ref) => {
    const tooltipId = useId();
    const [open, setOpen] = useState(false);

    const {
      triggerAttrs,
      triggerClassName,
      tooltipAttrs,
      tooltipClassName,
      handlers,
    } = createTooltipBehavior({
      open,
      tooltipId,
      onOpenChange: setOpen,
    });

    const triggerProps = {
      ...triggerAttrs,
      'aria-describedby': tooltipId,
    };

    const triggerContent = isValidElement(children) ? (
      cloneElement(children as ReactElement, {
        ...triggerProps,
        ...handlers,
        className: cn(
          (children as ReactElement).props.className,
          triggerClassName
        ),
        ref,
      })
    ) : (
      <span
        ref={ref as React.ForwardedRef<HTMLSpanElement>}
        className={triggerClassName}
        {...triggerProps}
        {...handlers}
        {...props}
      >
        {children}
      </span>
    );

    return (
      <span className={cn(triggerClassName, className)} {...props}>
        {triggerContent}
        <div
          {...tooltipAttrs}
          className={cn(tooltipClassName, `tooltip-bubble--${side}`)}
          role="tooltip"
        >
          {content}
        </div>
      </span>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
export default Tooltip;
