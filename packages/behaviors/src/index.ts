/**
 * @ui-construction-library/behaviors — public barrel.
 *
 * Framework-agnostic behavior layer: pure JS state machines,
 * ARIA attribute factories, and interaction logic.
 *
 * No React, no Vue, no DOM framework assumptions.
 */

export type { AccordionTriggerBehaviorOptions } from './accordion';
export {
  createAccordionContentBehavior,
  createAccordionTriggerBehavior,
} from './accordion';
export type { ButtonBehaviorOptions } from './button';
// Behavior factories (pure JS — no DOM required)
export { createButtonBehavior } from './button';
export type { DialogBehaviorOptions } from './dialog';

export { createDialogBehavior } from './dialog';
export type { FieldBehaviorOptions } from './field';
export { createFieldBehavior } from './field';
// Focus trap (DOM utility — requires HTMLElement)
export { getFocusableElements, trapFocus } from './focusTrap';
export type { PopoverBehaviorOptions } from './popover';
export { createPopoverBehavior } from './popover';
export type { SliderBehaviorOptions } from './slider';
export { createSliderBehavior } from './slider';
export type { SwitchBehaviorOptions } from './switch';
export { createSwitchBehavior } from './switch';
export type { TabTriggerBehaviorOptions } from './tabs';
export { createTabContentBehavior, createTabTriggerBehavior } from './tabs';
