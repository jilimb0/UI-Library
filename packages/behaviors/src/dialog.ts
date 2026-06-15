/**
 * Dialog behavior — framework-agnostic open/close + ARIA + handlers.
 */

export interface DialogBehaviorOptions {
  open?: boolean;
  titleId?: string;
  descriptionId?: string;
  onClose?: () => void;
}

export function createDialogBehavior(opts?: DialogBehaviorOptions) {
  const open = opts?.open ?? false;
  const onClose = opts?.onClose;

  return {
    triggerAttrs: {
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    overlayAttrs: {
      'data-state': open ? ('open' as const) : ('closed' as const),
      onClick: (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      },
    },
    contentAttrs: {
      role: 'dialog' as const,
      'aria-modal': true,
      'aria-labelledby': opts?.titleId,
      'aria-describedby': opts?.descriptionId,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    titleAttrs: {
      id: opts?.titleId,
    },
    descriptionAttrs: {
      id: opts?.descriptionId,
    },
    className: {
      trigger: 'ucl-dialog-trigger',
      overlay: 'ucl-dialog-overlay',
      content: 'ucl-dialog-content',
    },
    handlers: {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose?.();
        }
      },
    },
  };
}
