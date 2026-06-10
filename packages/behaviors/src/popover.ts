/**
 * Popover behavior — framework-agnostic open/close + ARIA.
 */

export interface PopoverBehaviorOptions {
  open?: boolean;
  modal?: boolean;
}

export function createPopoverBehavior(opts?: PopoverBehaviorOptions) {
  const open = opts?.open ?? false;
  const modal = opts?.modal ?? false;

  return {
    triggerAttrs: {
      'aria-haspopup': 'dialog' as const,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    contentAttrs: {
      role: 'dialog' as const,
      'aria-modal': modal || undefined,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
  };
}
