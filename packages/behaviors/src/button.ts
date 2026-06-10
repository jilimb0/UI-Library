/**
 * Button behavior — framework-agnostic ARIA and data attributes.
 */

export interface ButtonBehaviorOptions {
  disabled?: boolean;
  loading?: boolean;
}

export function createButtonBehavior(opts?: ButtonBehaviorOptions) {
  const disabled = opts?.disabled || opts?.loading || false;
  const loading = opts?.loading || false;

  return {
    attrs: {
      'data-disabled': disabled || undefined,
      'data-loading': loading || undefined,
      'aria-disabled': disabled || undefined,
      'aria-busy': loading || undefined,
    },
  };
}
