/**
 * Switch behavior — framework-agnostic toggle state machine.
 */

export interface SwitchBehaviorOptions {
  checked?: boolean;
  disabled?: boolean;
}

export function createSwitchBehavior(opts?: SwitchBehaviorOptions) {
  const checked = opts?.checked ?? false;

  return {
    rootAttrs: {
      role: 'switch' as const,
      'aria-checked': checked,
      'data-state': checked ? ('checked' as const) : ('unchecked' as const),
      disabled: opts?.disabled,
    },
    thumbAttrs: {
      'data-state': checked ? ('checked' as const) : ('unchecked' as const),
    },
  };
}
