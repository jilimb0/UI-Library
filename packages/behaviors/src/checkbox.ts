/**
 * Checkbox behavior — framework-agnostic checkbox state + ARIA + indeterminate.
 */

export interface CheckboxBehaviorOptions {
  checked?: boolean;
  /** Indeterminate state (overrides checked visually). */
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** ID of the checkbox element. */
  id?: string;
  /** ID of the label element. */
  labelId?: string;
  /** ID of the description element. */
  descriptionId?: string;
  /** ID of the error element. */
  errorId?: string;
  hasError?: boolean;
}

export function createCheckboxBehavior(opts?: CheckboxBehaviorOptions) {
  const checked = opts?.checked ?? false;
  const indeterminate = opts?.indeterminate || false;
  const disabled = opts?.disabled || false;
  const onCheckedChange = opts?.onCheckedChange;

  const describedByParts = [
    opts?.descriptionId,
    opts?.hasError ? opts?.errorId : null,
  ].filter(Boolean);

  const ariaChecked = indeterminate ? ('mixed' as const) : checked;

  return {
    checkboxAttrs: {
      id: opts?.id,
      role: 'checkbox' as const,
      'aria-checked': ariaChecked,
      'aria-disabled': disabled || undefined,
      'aria-labelledby': opts?.labelId,
      'aria-describedby':
        describedByParts.length > 0 ? describedByParts.join(' ') : undefined,
      'aria-invalid': opts?.hasError || undefined,
      'data-state': checked ? ('checked' as const) : ('unchecked' as const),
      'data-indeterminate': indeterminate || undefined,
      'data-disabled': disabled || undefined,
      'data-error': opts?.hasError || undefined,
      tabIndex: disabled ? -1 : 0,
    },
    checkboxClassName: `ucl-checkbox ${indeterminate ? 'ucl-checkbox--indeterminate' : ''} ${checked ? 'ucl-checkbox--checked' : ''} ${disabled ? 'ucl-checkbox--disabled' : ''}`,
    handlers: {
      onClick: (e?: Event) => {
        if (disabled) {
          e?.preventDefault();
          return;
        }
        onCheckedChange?.(!checked);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCheckedChange?.(!checked);
        }
      },
    },
  };
}
