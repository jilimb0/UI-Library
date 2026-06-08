/**
 * Tabs behavior — framework-agnostic tab selection state.
 */

export interface TabTriggerBehaviorOptions {
  /** Currently active tab value. */
  value: string;
  /** This trigger's tab value. */
  tabValue: string;
}

export function createTabTriggerBehavior(opts: TabTriggerBehaviorOptions) {
  const active = opts.value === opts.tabValue;
  return {
    triggerAttrs: {
      role: 'tab' as const,
      'aria-selected': active,
      'data-state': active ? ('active' as const) : ('inactive' as const),
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
  };
}
