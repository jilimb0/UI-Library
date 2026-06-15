/**
 * Menu behavior — framework-agnostic menu + menuitem + keyboard nav.
 */

export interface MenuBehaviorOptions {
  open?: boolean;
  onClose?: () => void;
  /** ID of the menu element. */
  menuId?: string;
  /** ID of the trigger element. */
  triggerId?: string;
  /** ID of the label element. */
  labelId?: string;
}

export function createMenuBehavior(opts?: MenuBehaviorOptions) {
  const open = opts?.open ?? false;

  return {
    triggerAttrs: {
      'aria-haspopup': 'menu' as const,
      'aria-expanded': open,
      'aria-controls': open ? opts?.menuId : undefined,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    triggerClassName: 'ucl-menu-trigger',
    menuAttrs: {
      id: opts?.menuId,
      role: 'menu' as const,
      'aria-labelledby': opts?.labelId ?? opts?.triggerId,
      'data-state': open ? ('open' as const) : ('closed' as const),
    },
    menuClassName: 'ucl-menu',
    handlers: {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          opts?.onClose?.();
        }
      },
    },
  };
}

export interface MenuItemBehaviorOptions {
  disabled?: boolean;
  onClick?: () => void;
  /** For checkbox/radio menu items. */
  checked?: boolean;
}

export function createMenuItemBehavior(opts?: MenuItemBehaviorOptions) {
  const disabled = opts?.disabled || false;
  const checked = opts?.checked;

  return {
    itemAttrs: {
      role: 'menuitem' as const,
      'aria-disabled': disabled || undefined,
      'aria-checked': checked !== undefined ? checked : undefined,
      tabIndex: disabled ? -1 : 0,
      'data-disabled': disabled || undefined,
      'data-checked':
        checked !== undefined ? (checked ? 'true' : 'false') : undefined,
    },
    itemClassName: `ucl-menu-item ${disabled ? 'ucl-menu-item--disabled' : ''}`,
    handlers: {
      onClick: (e?: Event) => {
        if (disabled) {
          e?.preventDefault();
          return;
        }
        opts?.onClick?.();
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          opts?.onClick?.();
        }
      },
    },
  };
}
