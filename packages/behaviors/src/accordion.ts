/**
 * Accordion behavior — framework-accordion expand/collapse state.
 */

export interface AccordionTriggerBehaviorOptions {
  /** Whether this item is currently open. */
  open: boolean;
}

export function createAccordionTriggerBehavior(
  opts: AccordionTriggerBehaviorOptions
) {
  return {
    triggerAttrs: {
      'aria-expanded': opts.open,
      'data-state': opts.open ? ('open' as const) : ('closed' as const),
    },
  };
}

export function createAccordionContentBehavior(
  opts: AccordionTriggerBehaviorOptions
) {
  return {
    contentAttrs: {
      'data-state': opts.open ? ('open' as const) : ('closed' as const),
    },
  };
}
