/**
 * @ui-construction-library/behaviors — public barrel.
 *
 * Framework-agnostic behavior layer: pure JS state machines,
 * ARIA attribute factories, and interaction logic.
 *
 * No React, no Vue, no DOM framework assumptions.
 */

export type {
  AccordionContentBehaviorOptions,
  AccordionTriggerBehaviorOptions,
} from './accordion';
export {
  createAccordionContentBehavior,
  createAccordionTriggerBehavior,
} from './accordion';
export type {
  ButtonBehaviorOptions,
  ButtonSize,
  ButtonVariant,
} from './button';
// Behavior factories (pure JS — no DOM required)
export { createButtonBehavior } from './button';
export type { CheckboxBehaviorOptions } from './checkbox';
export { createCheckboxBehavior } from './checkbox';
export { cx } from './cx';
export type { DialogBehaviorOptions } from './dialog';
export { createDialogBehavior } from './dialog';
export type { FieldBehaviorOptions } from './field';
export { createFieldBehavior } from './field';
// Focus trap & scroll lock (DOM utilities — require HTMLElement)
export { getFocusableElements, trapFocus } from './focusTrap';
export type { MenuBehaviorOptions, MenuItemBehaviorOptions } from './menu';
export { createMenuBehavior, createMenuItemBehavior } from './menu';
export type { PopoverBehaviorOptions } from './popover';
export { createPopoverBehavior } from './popover';
export { lockBodyScroll } from './scrollLock';
export type {
  SelectBehaviorOptions,
  SelectOptionBehaviorOptions,
} from './select';
export { createSelectBehavior, createSelectOptionBehavior } from './select';
export type { SliderBehaviorOptions } from './slider';
export { createSliderBehavior } from './slider';
export type { SwitchBehaviorOptions, SwitchSize } from './switch';
export { createSwitchBehavior } from './switch';
export type { TabListBehaviorOptions, TabTriggerBehaviorOptions } from './tabs';
export {
  createTabContentBehavior,
  createTabListBehavior,
  createTabTriggerBehavior,
} from './tabs';
export type { TooltipBehaviorOptions } from './tooltip';
export { createTooltipBehavior } from './tooltip';
