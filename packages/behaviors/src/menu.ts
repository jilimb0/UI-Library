/**
 * Menu behavior — framework-agnostic menu + menuitem + keyboard nav.
 */

export interface MenuBehaviorOptions {
  open?: boolean;
  onClose?: () => void;
  menuId?: string;
  triggerId?: string;
  labelId?: string;
  /** Navigate to next menu item (APG ArrowDown). */
  onNextItem?: () => void;
  /** Navigate to previous menu item (APG ArrowUp). */
  onPrevItem?: () => void;
  /** Focus first menu item (APG Home). */
  onFirstItem?: () => void;
  /** Focus last menu item (APG End). */
  onLastItem?: () => void;
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
      tabIndex: -1,
    },
    menuClassName: 'ucl-menu',
    handlers: {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          opts?.onClose?.();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          opts?.onNextItem?.();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          opts?.onPrevItem?.();
        } else if (e.key === 'Home') {
          e.preventDefault();
          opts?.onFirstItem?.();
        } else if (e.key === 'End') {
          e.preventDefault();
          opts?.onLastItem?.();
        }
      },
    },
  };
}

export interface MenuItemBehaviorOptions {
  disabled?: boolean;
  onClick?: () => void;
  checked?: boolean;
  /** Whether this item is the active (focused) item for roving tabindex. */
  isActive?: boolean;
}

export function createMenuItemBehavior(opts?: MenuItemBehaviorOptions) {
  const disabled = opts?.disabled || false;
  const checked = opts?.checked;
  const isActive = opts?.isActive ?? false;

  return {
    itemAttrs: {
      role: 'menuitem' as const,
      'aria-disabled': disabled || undefined,
      'aria-checked': checked !== undefined ? checked : undefined,
      tabIndex: disabled ? -1 : isActive ? 0 : -1,
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
