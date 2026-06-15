/**
 * Tabs behavior — framework-agnostic tab selection + keyboard navigation.
 */

export interface TabTriggerBehaviorOptions {
  /** Currently active tab value. */
  value: string;
  /** This trigger's tab value. */
  tabValue: string;
  /** Callback when a tab is selected. */
  onValueChange?: (value: string) => void;
  /** Callback to focus next tab. */
  onNext?: () => void;
  /** Callback to focus previous tab. */
  onPrev?: () => void;
}

export function createTabTriggerBehavior(opts: TabTriggerBehaviorOptions) {
  const active = opts.value === opts.tabValue;

  return {
    triggerAttrs: {
      role: 'tab' as const,
      'aria-selected': active,
      'data-state': active ? ('active' as const) : ('inactive' as const),
      tabIndex: active ? 0 : -1,
    },
    className: `ucl-tabs-trigger ${active ? 'ucl-tabs-trigger--active' : ''}`,
    handlers: {
      onClick: () => {
        opts.onValueChange?.(opts.tabValue);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          opts.onNext?.();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          opts.onPrev?.();
        } else if (e.key === 'Home') {
          e.preventDefault();
          opts.onPrev?.();
        } else if (e.key === 'End') {
          e.preventDefault();
          opts.onNext?.();
        }
      },
    },
  };
}

export function createTabContentBehavior(opts: TabTriggerBehaviorOptions) {
  const active = opts.value === opts.tabValue;
  return {
    contentAttrs: {
      role: 'tabpanel' as const,
      hidden: !active,
      'data-state': active ? ('active' as const) : ('inactive' as const),
    },
    className: `ucl-tabs-content ${active ? 'ucl-tabs-content--active' : ''}`,
  };
}

export interface TabListBehaviorOptions {
  /** Orientation of the tab list. */
  orientation?: 'horizontal' | 'vertical';
}

export function createTabListBehavior(opts?: TabListBehaviorOptions) {
  const orientation = opts?.orientation ?? 'horizontal';
  return {
    listAttrs: {
      role: 'tablist' as const,
      'aria-orientation': orientation,
      'data-orientation': orientation,
    },
    className: 'ucl-tabs-list',
  };
}
