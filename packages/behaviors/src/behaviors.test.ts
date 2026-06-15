/**
 * Behaviors comprehensive test suite.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  createAccordionContentBehavior,
  createAccordionTriggerBehavior,
  createButtonBehavior,
  createCheckboxBehavior,
  createDialogBehavior,
  createFieldBehavior,
  createMenuBehavior,
  createMenuItemBehavior,
  createPopoverBehavior,
  createSelectBehavior,
  createSelectOptionBehavior,
  createSliderBehavior,
  createSwitchBehavior,
  createTabContentBehavior,
  createTabListBehavior,
  createTabTriggerBehavior,
  createTooltipBehavior,
} from './index';

const createKeyboardEvent = (key: string) =>
  ({ key, preventDefault: vi.fn() }) as unknown as KeyboardEvent;

const _createMouseEvent = () =>
  ({
    currentTarget: { nodeName: 'DIV' },
    target: { nodeName: 'DIV' },
    bubbles: true,
    preventDefault: vi.fn(),
  }) as unknown as MouseEvent;

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

describe('createButtonBehavior', () => {
  it('returns empty attrs when no options', () => {
    const { attrs, className, handlers } = createButtonBehavior();
    expect(attrs['data-disabled']).toBeUndefined();
    expect(attrs['data-loading']).toBeUndefined();
    expect(attrs['data-disabled']).toBeUndefined();
    expect(attrs['aria-busy']).toBeUndefined();
    expect(className).toBe('ucl-button ucl-button--default');
    expect(handlers.onClick).toBeDefined();
    expect(handlers.onKeyDown).toBeDefined();
  });

  it('sets disabled attributes when disabled', () => {
    const { attrs, className } = createButtonBehavior({ disabled: true });
    expect(attrs['data-disabled']).toBe(true);
    expect(attrs['data-disabled']).toBe(true);
    expect(className).toBe('ucl-button ucl-button--default');
  });

  it('sets loading and disabled when loading', () => {
    const { attrs, className } = createButtonBehavior({
      loading: true,
      variant: 'destructive',
      size: 'lg',
    });
    expect(attrs['data-loading']).toBe(true);
    expect(attrs['data-disabled']).toBe(true);
    expect(attrs['aria-busy']).toBe(true);
    expect(className).toBe('ucl-button ucl-button--destructive ucl-button--lg');
  });

  it('prevents click when disabled', () => {
    const handler = { onClick: (_e?: Event) => {} };
    const spy = vi.spyOn(handler, 'onClick');
    const { handlers } = createButtonBehavior({
      disabled: true,
      onClick: handler.onClick,
    });
    const e = new Event('click');
    const preventDefaultSpy = vi.spyOn(e, 'preventDefault');
    handlers.onClick(e);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('calls onClick when enabled', () => {
    const handler = { onClick: (_e?: Event) => {} };
    const spy = vi.spyOn(handler, 'onClick');
    const { handlers } = createButtonBehavior({ onClick: handler.onClick });
    const e = new Event('click');
    handlers.onClick(e);
    expect(spy).toHaveBeenCalledWith(e);
  });

  it('triggers onClick via Enter key', () => {
    const handler = { onClick: (_e?: Event) => {} };
    const spy = vi.spyOn(handler, 'onClick');
    const { handlers } = createButtonBehavior({ onClick: handler.onClick });
    const e = createKeyboardEvent('Enter');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });

  it('triggers onClick via Space key', () => {
    const handler = { onClick: (_e?: Event) => {} };
    const spy = vi.spyOn(handler, 'onClick');
    const { handlers } = createButtonBehavior({ onClick: handler.onClick });
    const e = createKeyboardEvent(' ');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

describe('createSwitchBehavior', () => {
  it('returns unchecked state by default', () => {
    const { rootAttrs, thumbAttrs, rootClassName, thumbClassName, handlers } =
      createSwitchBehavior();
    expect(rootAttrs.role).toBe('switch');
    expect(rootAttrs['aria-checked']).toBe(false);
    expect(rootAttrs['data-state']).toBe('unchecked');
    expect(thumbAttrs['data-state']).toBe('unchecked');
    expect(rootClassName).toBe('ucl-switch');
    expect(thumbClassName).toBe('ucl-switch-thumb');
    expect(handlers.onClick).toBeDefined();
  });

  it('returns checked state', () => {
    const { rootAttrs, thumbAttrs } = createSwitchBehavior({ checked: true });
    expect(rootAttrs['aria-checked']).toBe(true);
    expect(rootAttrs['data-state']).toBe('checked');
    expect(thumbAttrs['data-state']).toBe('checked');
  });

  it('forwards disabled', () => {
    const { rootAttrs } = createSwitchBehavior({ disabled: true });
    expect(rootAttrs.disabled).toBe(true);
    expect(rootAttrs['data-disabled']).toBe(true);
  });

  it('applies size class', () => {
    const { rootClassName } = createSwitchBehavior({ size: 'sm' });
    expect(rootClassName).toBe('ucl-switch ucl-switch--sm');
  });

  it('toggles on click', () => {
    const handler = { onCheckedChange: (_checked: boolean) => {} };
    const spy = vi.spyOn(handler, 'onCheckedChange');
    const { handlers } = createSwitchBehavior({
      checked: false,
      onCheckedChange: handler.onCheckedChange,
    });
    handlers.onClick();
    expect(spy).toHaveBeenCalledWith(true);
  });
});

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

describe('createDialogBehavior', () => {
  it('returns closed state by default', () => {
    const { contentAttrs, overlayAttrs, className, handlers } =
      createDialogBehavior();
    expect(contentAttrs.role).toBe('dialog');
    expect(contentAttrs['aria-modal']).toBe(true);
    expect(contentAttrs['data-state']).toBe('closed');
    expect(overlayAttrs['data-state']).toBe('closed');
    expect(className.overlay).toBe('ucl-dialog-overlay');
    expect(className.content).toBe('ucl-dialog-content');
    expect(handlers.onKeyDown).toBeDefined();
  });

  it('returns open state', () => {
    const { contentAttrs, overlayAttrs } = createDialogBehavior({ open: true });
    expect(contentAttrs['data-state']).toBe('open');
    expect(overlayAttrs['data-state']).toBe('open');
  });

  it('passes title and description IDs', () => {
    const result = createDialogBehavior({
      titleId: 'dlg-title',
      descriptionId: 'dlg-desc',
    });
    expect(result.contentAttrs['aria-labelledby']).toBe('dlg-title');
    expect(result.contentAttrs['aria-describedby']).toBe('dlg-desc');
    expect(result.titleAttrs.id).toBe('dlg-title');
    expect(result.descriptionAttrs.id).toBe('dlg-desc');
  });

  it('calls onClose when overlay clicked', () => {
    const handler = { onClose: () => {} };
    const spy = vi.spyOn(handler, 'onClose');
    const { overlayAttrs } = createDialogBehavior({ onClose: handler.onClose });
    const currentTarget = { nodeName: 'DIV' } as unknown as EventTarget;
    const target = currentTarget;
    const e = {
      bubbles: true,
      target,
      currentTarget,
      preventDefault: vi.fn(),
    } as unknown as MouseEvent;
    overlayAttrs.onClick(e);
    expect(spy).toHaveBeenCalled();
  });

  it('calls onClose on Escape', () => {
    const handler = { onClose: () => {} };
    const spy = vi.spyOn(handler, 'onClose');
    const { handlers } = createDialogBehavior({ onClose: handler.onClose });
    const e = createKeyboardEvent('Escape');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

describe('createTabTriggerBehavior', () => {
  it('returns active state when value matches', () => {
    const { triggerAttrs, className, handlers } = createTabTriggerBehavior({
      value: 'tab1',
      tabValue: 'tab1',
    });
    expect(triggerAttrs.role).toBe('tab');
    expect(triggerAttrs['aria-selected']).toBe(true);
    expect(triggerAttrs['data-state']).toBe('active');
    expect(triggerAttrs.tabIndex).toBe(0);
    expect(className).toBe('ucl-tabs-trigger ucl-tabs-trigger--active');
    expect(handlers.onClick).toBeDefined();
  });

  it('returns inactive state when value differs', () => {
    const { triggerAttrs, className } = createTabTriggerBehavior({
      value: 'tab1',
      tabValue: 'tab2',
    });
    expect(triggerAttrs['aria-selected']).toBe(false);
    expect(triggerAttrs['data-state']).toBe('inactive');
    expect(triggerAttrs.tabIndex).toBe(-1);
    expect(className).toBe('ucl-tabs-trigger ');
  });

  it('calls onValueChange on click', () => {
    const handler = { onValueChange: (_v: string) => {} };
    const spy = vi.spyOn(handler, 'onValueChange');
    const { handlers } = createTabTriggerBehavior({
      value: 'a',
      tabValue: 'b',
      onValueChange: handler.onValueChange,
    });
    handlers.onClick();
    expect(spy).toHaveBeenCalledWith('b');
  });

  it('calls onNext on ArrowRight', () => {
    const handler = { onNext: () => {} };
    const spy = vi.spyOn(handler, 'onNext');
    const { handlers } = createTabTriggerBehavior({
      value: 'a',
      tabValue: 'a',
      onNext: handler.onNext,
    });
    const e = createKeyboardEvent('ArrowRight');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });

  it('calls onPrev on ArrowLeft', () => {
    const handler = { onPrev: () => {} };
    const spy = vi.spyOn(handler, 'onPrev');
    const { handlers } = createTabTriggerBehavior({
      value: 'a',
      tabValue: 'a',
      onPrev: handler.onPrev,
    });
    const e = createKeyboardEvent('ArrowLeft');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });
});

describe('createTabContentBehavior', () => {
  it('returns visible when active', () => {
    const { contentAttrs, className } = createTabContentBehavior({
      value: 'a',
      tabValue: 'a',
    });
    expect(contentAttrs.role).toBe('tabpanel');
    expect(contentAttrs.hidden).toBe(false);
    expect(contentAttrs['data-state']).toBe('active');
    expect(className).toBe('ucl-tabs-content ucl-tabs-content--active');
  });

  it('returns hidden when inactive', () => {
    const { contentAttrs, className } = createTabContentBehavior({
      value: 'a',
      tabValue: 'b',
    });
    expect(contentAttrs.hidden).toBe(true);
    expect(contentAttrs['data-state']).toBe('inactive');
    expect(className).toBe('ucl-tabs-content ');
  });
});

describe('createTabListBehavior', () => {
  it('returns horizontal by default', () => {
    const { listAttrs, className } = createTabListBehavior();
    expect(listAttrs.role).toBe('tablist');
    expect(listAttrs['aria-orientation']).toBe('horizontal');
    expect(listAttrs['data-orientation']).toBe('horizontal');
    expect(className).toBe('ucl-tabs-list');
  });

  it('returns vertical when set', () => {
    const { listAttrs } = createTabListBehavior({ orientation: 'vertical' });
    expect(listAttrs['aria-orientation']).toBe('vertical');
  });
});

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

describe('createFieldBehavior', () => {
  it('returns correct ARIA for a normal field', () => {
    const {
      fieldAttrs,
      labelAttrs,
      inputAttrs,
      fieldClassName,
      labelClassName,
      inputClassName,
    } = createFieldBehavior({
      fieldId: 'name',
    });
    expect(fieldAttrs['data-field']).toBe('');
    expect(labelAttrs.htmlFor).toBe('name');
    expect(inputAttrs.id).toBe('name');
    expect(inputAttrs['aria-invalid']).toBeUndefined();
    expect(fieldClassName).toBe('ucl-field');
    expect(labelClassName).toBe('ucl-field-label');
    expect(inputClassName).toBe('ucl-input ');
  });

  it('sets error state and aria-describedby', () => {
    const { fieldAttrs, inputAttrs, errorAttrs } = createFieldBehavior({
      fieldId: 'email',
      hasError: true,
      errorId: 'email-err',
      descriptionId: 'email-desc',
    });
    expect(fieldAttrs['data-error']).toBe(true);
    expect(inputAttrs['aria-invalid']).toBe(true);
    expect(inputAttrs['aria-describedby']).toBe('email-desc email-err');
    expect(errorAttrs['aria-live']).toBe('polite');
  });

  it('forwards disabled and required', () => {
    const { inputAttrs } = createFieldBehavior({
      fieldId: 'x',
      disabled: true,
      required: true,
    });
    expect(inputAttrs.disabled).toBe(true);
    expect(inputAttrs.required).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

describe('createSliderBehavior', () => {
  it('returns correct ARIA for mid-range value', () => {
    const {
      thumbAttrs,
      rangeAttrs,
      thumbClassName,
      rangeClassName,
      trackClassName,
    } = createSliderBehavior({
      value: 50,
      min: 0,
      max: 100,
    });
    expect(thumbAttrs.role).toBe('slider');
    expect(thumbAttrs['aria-valuemin']).toBe(0);
    expect(thumbAttrs['aria-valuemax']).toBe(100);
    expect(thumbAttrs['aria-valuenow']).toBe(50);
    expect(rangeAttrs.style.width).toBe('50%');
    expect(thumbClassName).toBe('ucl-slider-thumb');
    expect(rangeClassName).toBe('ucl-slider-range');
    expect(trackClassName).toBe('ucl-slider-track');
  });

  it('defaults min=0, max=100', () => {
    const { thumbAttrs } = createSliderBehavior({ value: 25 });
    expect(thumbAttrs['aria-valuemin']).toBe(0);
    expect(thumbAttrs['aria-valuemax']).toBe(100);
  });

  it('increments on ArrowRight', () => {
    const handler = { onChange: (_v: number) => {} };
    const spy = vi.spyOn(handler, 'onChange');
    const { handlers } = createSliderBehavior({
      value: 50,
      onChange: handler.onChange,
    });
    const e = createKeyboardEvent('ArrowRight');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalledWith(51);
  });

  it('decrements on ArrowLeft', () => {
    const handler = { onChange: (_v: number) => {} };
    const spy = vi.spyOn(handler, 'onChange');
    const { handlers } = createSliderBehavior({
      value: 50,
      onChange: handler.onChange,
    });
    const e = createKeyboardEvent('ArrowLeft');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalledWith(49);
  });
});

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

describe('createAccordionTriggerBehavior', () => {
  it('returns open state', () => {
    const { triggerAttrs, className, handlers } =
      createAccordionTriggerBehavior({ open: true });
    expect(triggerAttrs['aria-expanded']).toBe(true);
    expect(triggerAttrs['data-state']).toBe('open');
    expect(className).toBe('ucl-accordion-trigger ucl-accordion-trigger--open');
    expect(handlers.onClick).toBeDefined();
  });

  it('returns closed state', () => {
    const { triggerAttrs, className } = createAccordionTriggerBehavior({
      open: false,
    });
    expect(triggerAttrs['aria-expanded']).toBe(false);
    expect(triggerAttrs['data-state']).toBe('closed');
    expect(className).toBe('ucl-accordion-trigger ');
  });

  it('sets aria-controls', () => {
    const { triggerAttrs } = createAccordionTriggerBehavior({
      open: true,
      contentId: 'panel-1',
    });
    expect(triggerAttrs['aria-controls']).toBe('panel-1');
  });

  it('calls onToggle on click', () => {
    const handler = { onToggle: () => {} };
    const spy = vi.spyOn(handler, 'onToggle');
    const { handlers } = createAccordionTriggerBehavior({
      open: true,
      onToggle: handler.onToggle,
    });
    handlers.onClick();
    expect(spy).toHaveBeenCalled();
  });
});

describe('createAccordionContentBehavior', () => {
  it('returns open data-state', () => {
    const { contentAttrs, className } = createAccordionContentBehavior({
      open: true,
    });
    expect(contentAttrs['data-state']).toBe('open');
    expect(className).toBe('ucl-accordion-content ucl-accordion-content--open');
  });

  it('sets aria-labelledby', () => {
    const { contentAttrs } = createAccordionContentBehavior({
      open: true,
      triggerId: 'trigger-1',
    });
    expect(contentAttrs['aria-labelledby']).toBe('trigger-1');
  });
});

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

describe('createPopoverBehavior', () => {
  it('returns closed state by default', () => {
    const { triggerAttrs, contentAttrs, className, handlers } =
      createPopoverBehavior();
    expect(triggerAttrs['aria-haspopup']).toBe('dialog');
    expect(triggerAttrs['data-state']).toBe('closed');
    expect(contentAttrs['data-state']).toBe('closed');
    expect(className.trigger).toBe('ucl-popover-trigger');
    expect(className.content).toBe('ucl-popover-content');
    expect(handlers.onKeyDown).toBeDefined();
  });

  it('returns open state', () => {
    const { contentAttrs } = createPopoverBehavior({ open: true });
    expect(contentAttrs.role).toBe('dialog');
    expect(contentAttrs['data-state']).toBe('open');
  });

  it('forwards modal', () => {
    const { contentAttrs } = createPopoverBehavior({ open: true, modal: true });
    expect(contentAttrs['aria-modal']).toBe(true);
  });

  it('sets aria-expanded and aria-controls when open', () => {
    const { triggerAttrs } = createPopoverBehavior({
      open: true,
      contentId: 'pop-content',
    });
    expect(triggerAttrs['aria-expanded']).toBe(true);
    expect(triggerAttrs['aria-controls']).toBe('pop-content');
  });

  it('calls onClose on Escape', () => {
    const handler = { onClose: () => {} };
    const spy = vi.spyOn(handler, 'onClose');
    const { handlers } = createPopoverBehavior({ onClose: handler.onClose });
    const e = createKeyboardEvent('Escape');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

describe('createCheckboxBehavior', () => {
  it('returns unchecked state by default', () => {
    const { checkboxAttrs, checkboxClassName, handlers } =
      createCheckboxBehavior();
    expect(checkboxAttrs.role).toBe('checkbox');
    expect(checkboxAttrs['aria-checked']).toBe(false);
    expect(checkboxAttrs['data-state']).toBe('unchecked');
    expect(checkboxClassName).toContain('ucl-checkbox');
    expect(handlers.onClick).toBeDefined();
  });

  it('returns checked state', () => {
    const { checkboxAttrs, checkboxClassName } = createCheckboxBehavior({
      checked: true,
    });
    expect(checkboxAttrs['aria-checked']).toBe(true);
    expect(checkboxAttrs['data-state']).toBe('checked');
    expect(checkboxClassName).toContain('ucl-checkbox--checked');
  });

  it('returns indeterminate state', () => {
    const { checkboxAttrs, checkboxClassName } = createCheckboxBehavior({
      indeterminate: true,
    });
    expect(checkboxAttrs['aria-checked']).toBe('mixed');
    expect(checkboxAttrs['data-indeterminate']).toBe(true);
    expect(checkboxClassName.trim()).toBe(
      'ucl-checkbox ucl-checkbox--indeterminate'
    );
  });

  it('forwards disabled', () => {
    const { checkboxAttrs, checkboxClassName } = createCheckboxBehavior({
      disabled: true,
    });
    expect(checkboxAttrs['data-disabled']).toBe(true);
    expect(checkboxAttrs['data-disabled']).toBe(true);
    expect(checkboxClassName).toContain('ucl-checkbox--disabled');
  });

  it('calls onCheckedChange on click', () => {
    const handler = { onCheckedChange: (_checked: boolean) => {} };
    const spy = vi.spyOn(handler, 'onCheckedChange');
    const { handlers } = createCheckboxBehavior({
      checked: false,
      onCheckedChange: handler.onCheckedChange,
    });
    handlers.onClick();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('sets aria-describedby when description and error provided', () => {
    const { checkboxAttrs } = createCheckboxBehavior({
      descriptionId: 'desc',
      errorId: 'err',
      hasError: true,
    });
    expect(checkboxAttrs['aria-describedby']).toBe('desc err');
    expect(checkboxAttrs['aria-invalid']).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

describe('createSelectBehavior', () => {
  it('returns closed state by default', () => {
    const { triggerAttrs, listboxAttrs, triggerClassName, handlers } =
      createSelectBehavior();
    expect(triggerAttrs.role).toBe('combobox');
    expect(triggerAttrs['aria-haspopup']).toBe('listbox');
    expect(triggerAttrs['aria-expanded']).toBe(false);
    expect(triggerAttrs['data-state']).toBe('closed');
    expect(listboxAttrs.role).toBe('listbox');
    expect(listboxAttrs['data-state']).toBe('closed');
    expect(triggerClassName).toBe('ucl-select-trigger ');
    expect(handlers.onClick).toBeDefined();
  });

  it('returns open state', () => {
    const { triggerAttrs, listboxAttrs } = createSelectBehavior({ open: true });
    expect(triggerAttrs['aria-expanded']).toBe(true);
    expect(triggerAttrs['data-state']).toBe('open');
    expect(listboxAttrs['data-state']).toBe('open');
  });

  it('opens on ArrowDown', () => {
    const handler = { onOpenChange: (_open: boolean) => {} };
    const spy = vi.spyOn(handler, 'onOpenChange');
    const { handlers } = createSelectBehavior({
      onOpenChange: handler.onOpenChange,
    });
    const e = createKeyboardEvent('ArrowDown');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('closes on Escape', () => {
    const handler = { onOpenChange: (_open: boolean) => {} };
    const spy = vi.spyOn(handler, 'onOpenChange');
    const { handlers } = createSelectBehavior({
      open: true,
      onOpenChange: handler.onOpenChange,
    });
    const e = createKeyboardEvent('Escape');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalledWith(false);
  });
});

describe('createSelectOptionBehavior', () => {
  it('returns selected state', () => {
    const { optionAttrs, optionClassName, handlers } =
      createSelectOptionBehavior({
        value: 'a',
        selectedValue: 'a',
      });
    expect(optionAttrs['aria-selected']).toBe(true);
    expect(optionAttrs['data-selected']).toBe(true);
    expect(optionClassName).toBe(
      'ucl-select-option ucl-select-option--selected '
    );
    expect(handlers.onClick).toBeDefined();
  });

  it('returns disabled state', () => {
    const { optionAttrs, optionClassName } = createSelectOptionBehavior({
      value: 'a',
      disabled: true,
    });
    expect(optionAttrs['data-disabled']).toBe(true);
    expect(optionAttrs['data-disabled']).toBe(true);
    expect(optionClassName).toBe(
      'ucl-select-option  ucl-select-option--disabled'
    );
  });

  it('calls onSelect on click', () => {
    const handler = { onSelect: (_v: string) => {} };
    const spy = vi.spyOn(handler, 'onSelect');
    const { handlers } = createSelectOptionBehavior({
      value: 'a',
      onSelect: handler.onSelect,
    });
    handlers.onClick();
    expect(spy).toHaveBeenCalledWith('a');
  });
});

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

describe('createTooltipBehavior', () => {
  it('returns closed state by default', () => {
    const {
      triggerAttrs,
      tooltipAttrs,
      triggerClassName,
      tooltipClassName,
      handlers,
    } = createTooltipBehavior();
    expect(triggerAttrs['data-tooltip-state']).toBe('closed');
    expect(tooltipAttrs['data-state']).toBe('closed');
    expect(tooltipAttrs.role).toBe('tooltip');
    expect(triggerClassName).toBe('ucl-tooltip-trigger');
    expect(tooltipClassName).toBe('ucl-tooltip-bubble');
    expect(handlers.onMouseEnter).toBeDefined();
  });

  it('sets aria-describedby when open', () => {
    const { triggerAttrs } = createTooltipBehavior({
      open: true,
      tooltipId: 'tip-1',
    });
    expect(triggerAttrs['aria-describedby']).toBe('tip-1');
  });

  it('opens on mouse enter', () => {
    const handler = { onOpenChange: (_open: boolean) => {} };
    const spy = vi.spyOn(handler, 'onOpenChange');
    const { handlers } = createTooltipBehavior({
      onOpenChange: handler.onOpenChange,
    });
    handlers.onMouseEnter();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('closes on mouse leave', () => {
    const handler = { onOpenChange: (_open: boolean) => {} };
    const spy = vi.spyOn(handler, 'onOpenChange');
    const { handlers } = createTooltipBehavior({
      open: true,
      onOpenChange: handler.onOpenChange,
    });
    handlers.onMouseLeave();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('closes on Escape', () => {
    const handler = { onOpenChange: (_open: boolean) => {} };
    const spy = vi.spyOn(handler, 'onOpenChange');
    const { handlers } = createTooltipBehavior({
      open: true,
      onOpenChange: handler.onOpenChange,
    });
    const e = createKeyboardEvent('Escape');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalledWith(false);
  });
});

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

describe('createMenuBehavior', () => {
  it('returns closed state by default', () => {
    const {
      triggerAttrs,
      menuAttrs,
      triggerClassName,
      menuClassName,
      handlers,
    } = createMenuBehavior();
    expect(triggerAttrs['aria-haspopup']).toBe('menu');
    expect(triggerAttrs['data-state']).toBe('closed');
    expect(menuAttrs.role).toBe('menu');
    expect(menuAttrs['data-state']).toBe('closed');
    expect(triggerClassName).toBe('ucl-menu-trigger');
    expect(menuClassName).toBe('ucl-menu');
    expect(handlers.onKeyDown).toBeDefined();
  });

  it('returns open state', () => {
    const { triggerAttrs, menuAttrs } = createMenuBehavior({ open: true });
    expect(triggerAttrs['aria-expanded']).toBe(true);
    expect(triggerAttrs['data-state']).toBe('open');
    expect(menuAttrs['data-state']).toBe('open');
  });

  it('calls onClose on Escape', () => {
    const handler = { onClose: () => {} };
    const spy = vi.spyOn(handler, 'onClose');
    const { handlers } = createMenuBehavior({ onClose: handler.onClose });
    const e = createKeyboardEvent('Escape');
    handlers.onKeyDown(e);
    expect(spy).toHaveBeenCalled();
  });
});

describe('createMenuItemBehavior', () => {
  it('returns default state', () => {
    const { itemAttrs, itemClassName, handlers } = createMenuItemBehavior();
    expect(itemAttrs.role).toBe('menuitem');
    expect(itemAttrs.tabIndex).toBe(0);
    expect(itemClassName).toBe('ucl-menu-item ');
    expect(handlers.onClick).toBeDefined();
  });

  it('returns disabled state', () => {
    const { itemAttrs, itemClassName } = createMenuItemBehavior({
      disabled: true,
    });
    expect(itemAttrs['data-disabled']).toBe(true);
    expect(itemAttrs.tabIndex).toBe(-1);
    expect(itemClassName).toBe('ucl-menu-item ucl-menu-item--disabled');
  });

  it('returns checked state', () => {
    const { itemAttrs } = createMenuItemBehavior({ checked: true });
    expect(itemAttrs['aria-checked']).toBe(true);
    expect(itemAttrs['data-checked']).toBe('true');
  });

  it('calls onClick when clicked', () => {
    const handler = { onClick: () => {} };
    const spy = vi.spyOn(handler, 'onClick');
    const { handlers } = createMenuItemBehavior({ onClick: handler.onClick });
    handlers.onClick();
    expect(spy).toHaveBeenCalled();
  });
});
