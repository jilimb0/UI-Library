/**
 * Switch behavior — framework-agnostic toggle state machine + className + handlers.
 */

export type SwitchSize = 'sm' | 'default' | 'md' | 'lg';

export interface SwitchBehaviorOptions {
  checked?: boolean;
  disabled?: boolean;
  size?: SwitchSize;
  onCheckedChange?: (checked: boolean) => void;
}

export function createSwitchBehavior(opts?: SwitchBehaviorOptions) {
  const checked = opts?.checked ?? false;
  const disabled = opts?.disabled || false;
  const size = opts?.size ?? 'default';
  const onCheckedChange = opts?.onCheckedChange;

  const sizeClass =
    size === 'default' || size === 'md' ? '' : ` ucl-switch--${size}`;

  return {
    rootAttrs: {
      role: 'switch' as const,
      'aria-checked': checked,
      'data-state': checked ? ('checked' as const) : ('unchecked' as const),
      'data-disabled': disabled || undefined,
      disabled: disabled || undefined,
    },
    rootClassName: `ucl-switch${sizeClass}`,
    thumbAttrs: {
      'data-state': checked ? ('checked' as const) : ('unchecked' as const),
    },
    thumbClassName: 'ucl-switch-thumb',
    handlers: {
      onClick: (e?: Event) => {
        if (disabled) {
          e?.preventDefault();
          return;
        }
        onCheckedChange?.(!checked);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (disabled) return;
          onCheckedChange?.(!checked);
        }
      },
    },
  };
}
