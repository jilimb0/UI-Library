/**
 * Select behavior — framework-agnostic select/combobox ARIA + keyboard nav.
 */

export interface SelectBehaviorOptions {
  open?: boolean;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  /** ID of the listbox element. */
  listboxId?: string;
  /** ID of the trigger element. */
  triggerId?: string;
  /** ID of the label element. */
  labelId?: string;
}

export function createSelectBehavior(opts?: SelectBehaviorOptions) {
  const open = opts?.open ?? false;
  const disabled = opts?.disabled || false;
  const onOpenChange = opts?.onOpenChange;

  return {
    triggerAttrs: {
      role: 'combobox' as const,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': open,
      'aria-controls': open ? opts?.listboxId : undefined,
      'aria-labelledby': opts?.labelId,
      'aria-disabled': disabled || undefined,
      'data-state': open ? ('open' as const) : ('closed' as const),
      'data-disabled': disabled || undefined,
      'data-value': opts?.value,
      tabIndex: disabled ? -1 : 0,
    },
    triggerClassName: `ucl-select-trigger ${open ? 'ucl-select-trigger--open' : ''}`,
    listboxAttrs: {
      id: opts?.listboxId,
      role: 'listbox' as const,
      'aria-labelledby': opts?.labelId ?? opts?.triggerId,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    listboxClassName: 'ucl-select-listbox',
    handlers: {
      onClick: (e?: Event) => {
        if (disabled) {
          e?.preventDefault();
          return;
        }
        onOpenChange?.(!open);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (disabled) return;
        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
          case 'ArrowUp':
            e.preventDefault();
            if (!open) onOpenChange?.(true);
            break;
          case 'Escape':
            e.preventDefault();
            if (open) onOpenChange?.(false);
            break;
          case 'Tab':
            if (open) onOpenChange?.(false);
            break;
        }
      },
    },
  };
}

export interface SelectOptionBehaviorOptions {
  value: string;
  selectedValue?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

export function createSelectOptionBehavior(opts: SelectOptionBehaviorOptions) {
  const selected = opts.selectedValue === opts.value;
  const disabled = opts.disabled || false;

  return {
    optionAttrs: {
      role: 'option' as const,
      'aria-selected': selected,
      'data-selected': selected || undefined,
      'data-disabled': disabled || undefined,
      tabIndex: -1,
    },
    optionClassName: `ucl-select-option ${selected ? 'ucl-select-option--selected' : ''} ${disabled ? 'ucl-select-option--disabled' : ''}`,
    handlers: {
      onClick: (e?: Event) => {
        if (disabled) {
          e?.preventDefault();
          return;
        }
        opts.onSelect?.(opts.value);
      },
    },
  };
}
