/**
 * Dialog behavior — framework-agnostic open/close + ARIA.
 */

export interface DialogBehaviorOptions {
  open?: boolean;
  titleId?: string;
  descriptionId?: string;
}

export function createDialogBehavior(opts?: DialogBehaviorOptions) {
  const open = opts?.open ?? false;

  return {
    overlayAttrs: {
      'data-state': open ? ('open' as const) : ('closed' as const),
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
  };
}
