/**
 * Popover behavior — framework-agnostic open/close + ARIA + handlers.
 */

export interface PopoverBehaviorOptions {
  open?: boolean;
  modal?: boolean;
  onClose?: () => void;
  /** ID of the trigger element. */
  triggerId?: string;
  /** ID of the content panel. */
  contentId?: string;
}

export function createPopoverBehavior(opts?: PopoverBehaviorOptions) {
  const open = opts?.open ?? false;
  const modal = opts?.modal ?? false;
  const onClose = opts?.onClose;

  return {
    triggerAttrs: {
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'aria-controls': open ? opts?.contentId : undefined,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    contentAttrs: {
      id: opts?.contentId,
      role: 'dialog' as const,
      'aria-modal': modal || undefined,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    className: {
      trigger: 'ucl-popover-trigger',
      content: 'ucl-popover-content',
    },
    handlers: {
      onClick: (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose?.();
        }
      },
    },
  };
}
