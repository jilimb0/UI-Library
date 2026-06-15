/**
 * Accordion behavior — framework-agnostic expand/collapse + ARIA + handlers.
 */

export interface AccordionTriggerBehaviorOptions {
  /** Whether this item is currently open. */
  open: boolean;
  /** Callback to toggle this item. */
  onToggle?: () => void;
  /** ID of the content panel this trigger controls. */
  contentId?: string;
}

export function createAccordionTriggerBehavior(
  opts: AccordionTriggerBehaviorOptions
) {
  return {
    triggerAttrs: {
      'aria-expanded': opts.open,
      'aria-controls': opts.contentId,
      'data-state': opts.open ? ('open' as const) : ('closed' as const),
    },
    className: `ucl-accordion-trigger ${opts.open ? 'ucl-accordion-trigger--open' : ''}`,
    handlers: {
      onClick: () => {
        opts.onToggle?.();
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          opts.onToggle?.();
        }
      },
    },
  };
}

export interface AccordionContentBehaviorOptions {
  /** Whether this item is currently open. */
  open: boolean;
  /** ID of this content panel. */
  id?: string;
  /** ID of the trigger that controls this panel. */
  triggerId?: string;
}

export function createAccordionContentBehavior(
  opts: AccordionContentBehaviorOptions
) {
  return {
    contentAttrs: {
      id: opts.id,
      role: 'region' as const,
      'aria-labelledby': opts.triggerId,
      'data-state': opts.open ? ('open' as const) : ('closed' as const),
    },
    className: `ucl-accordion-content ${opts.open ? 'ucl-accordion-content--open' : ''}`,
  };
}
