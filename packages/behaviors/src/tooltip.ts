/**
 * Tooltip behavior — framework-agnostic show/hide + ARIA.
 */

export interface TooltipBehaviorOptions {
  open?: boolean;
  /** ID of the trigger element. */
  triggerId?: string;
  /** ID of the tooltip content element. */
  tooltipId?: string;
  onOpenChange?: (open: boolean) => void;
}

export function createTooltipBehavior(opts?: TooltipBehaviorOptions) {
  const open = opts?.open ?? false;
  const onOpenChange = opts?.onOpenChange;

  return {
    triggerAttrs: {
      'aria-describedby': opts?.tooltipId,
      'data-tooltip-trigger': 'true',
      'data-tooltip-state': open ? ('open' as const) : ('closed' as const),
    },
    triggerClassName: 'ucl-tooltip-trigger',
    tooltipAttrs: {
      id: opts?.tooltipId,
      role: 'tooltip' as const,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    tooltipClassName: 'ucl-tooltip-bubble',
    handlers: {
      onMouseEnter: () => {
        onOpenChange?.(true);
      },
      onMouseLeave: () => {
        onOpenChange?.(false);
      },
      onFocus: () => {
        onOpenChange?.(true);
      },
      onBlur: () => {
        onOpenChange?.(false);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange?.(false);
        }
      },
    },
  };
}
