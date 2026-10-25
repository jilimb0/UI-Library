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
  /** Focus next accordion header (APG ArrowDown). */
  onNext?: () => void;
  /** Focus previous accordion header (APG ArrowUp). */
  onPrev?: () => void;
  /** Focus first accordion header (APG Home). */
  onFirst?: () => void;
  /** Focus last accordion header (APG End). */
  onLast?: () => void;
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
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          opts.onNext?.();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          opts.onPrev?.();
        } else if (e.key === 'Home') {
          e.preventDefault();
          opts.onFirst?.();
        } else if (e.key === 'End') {
          e.preventDefault();
          opts.onLast?.();
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
