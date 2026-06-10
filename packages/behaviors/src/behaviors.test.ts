import { describe, expect, it } from 'vitest';
import {
  createAccordionContentBehavior,
  createAccordionTriggerBehavior,
  createButtonBehavior,
  createDialogBehavior,
  createFieldBehavior,
  createPopoverBehavior,
  createSliderBehavior,
  createSwitchBehavior,
  createTabContentBehavior,
  createTabTriggerBehavior,
} from './index';

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

describe('createButtonBehavior', () => {
  it('returns empty attrs when no options', () => {
    const { attrs } = createButtonBehavior();
    expect(attrs['data-disabled']).toBeUndefined();
    expect(attrs['data-loading']).toBeUndefined();
    expect(attrs['aria-disabled']).toBeUndefined();
    expect(attrs['aria-busy']).toBeUndefined();
  });

  it('sets disabled attributes when disabled', () => {
    const { attrs } = createButtonBehavior({ disabled: true });
    expect(attrs['data-disabled']).toBe(true);
    expect(attrs['aria-disabled']).toBe(true);
  });

  it('sets loading and disabled when loading', () => {
    const { attrs } = createButtonBehavior({ loading: true });
    expect(attrs['data-loading']).toBe(true);
    expect(attrs['data-disabled']).toBe(true);
    expect(attrs['aria-busy']).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

describe('createSwitchBehavior', () => {
  it('returns unchecked state by default', () => {
    const { rootAttrs, thumbAttrs } = createSwitchBehavior();
    expect(rootAttrs.role).toBe('switch');
    expect(rootAttrs['aria-checked']).toBe(false);
    expect(rootAttrs['data-state']).toBe('unchecked');
    expect(thumbAttrs['data-state']).toBe('unchecked');
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
  });
});

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

describe('createDialogBehavior', () => {
  it('returns closed state by default', () => {
    const { contentAttrs, overlayAttrs } = createDialogBehavior();
    expect(contentAttrs.role).toBe('dialog');
    expect(contentAttrs['aria-modal']).toBe(true);
    expect(contentAttrs['data-state']).toBe('closed');
    expect(overlayAttrs['data-state']).toBe('closed');
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
});

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

describe('createTabTriggerBehavior', () => {
  it('returns active state when value matches', () => {
    const { triggerAttrs } = createTabTriggerBehavior({
      value: 'tab1',
      tabValue: 'tab1',
    });
    expect(triggerAttrs.role).toBe('tab');
    expect(triggerAttrs['aria-selected']).toBe(true);
    expect(triggerAttrs['data-state']).toBe('active');
  });

  it('returns inactive state when value differs', () => {
    const { triggerAttrs } = createTabTriggerBehavior({
      value: 'tab1',
      tabValue: 'tab2',
    });
    expect(triggerAttrs['aria-selected']).toBe(false);
    expect(triggerAttrs['data-state']).toBe('inactive');
  });
});

describe('createTabContentBehavior', () => {
  it('returns visible when active', () => {
    const { contentAttrs } = createTabContentBehavior({
      value: 'a',
      tabValue: 'a',
    });
    expect(contentAttrs.role).toBe('tabpanel');
    expect(contentAttrs.hidden).toBe(false);
    expect(contentAttrs['data-state']).toBe('active');
  });

  it('returns hidden when inactive', () => {
    const { contentAttrs } = createTabContentBehavior({
      value: 'a',
      tabValue: 'b',
    });
    expect(contentAttrs.hidden).toBe(true);
    expect(contentAttrs['data-state']).toBe('inactive');
  });
});

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

describe('createFieldBehavior', () => {
  it('returns correct ARIA for a normal field', () => {
    const { fieldAttrs, labelAttrs, inputAttrs } = createFieldBehavior({
      fieldId: 'name',
    });
    expect(fieldAttrs['data-field']).toBe('');
    expect(labelAttrs.htmlFor).toBe('name');
    expect(inputAttrs.id).toBe('name');
    expect(inputAttrs['aria-invalid']).toBeUndefined();
  });

  it('sets error state and aria-describedby', () => {
    const { fieldAttrs, inputAttrs } = createFieldBehavior({
      fieldId: 'email',
      hasError: true,
      errorId: 'email-err',
      descriptionId: 'email-desc',
    });
    expect(fieldAttrs['data-error']).toBe(true);
    expect(inputAttrs['aria-invalid']).toBe(true);
    expect(inputAttrs['aria-describedby']).toBe('email-desc email-err');
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
    const { thumbAttrs, rangeAttrs } = createSliderBehavior({
      value: 50,
      min: 0,
      max: 100,
    });
    expect(thumbAttrs.role).toBe('slider');
    expect(thumbAttrs['aria-valuemin']).toBe(0);
    expect(thumbAttrs['aria-valuemax']).toBe(100);
    expect(thumbAttrs['aria-valuenow']).toBe(50);
    expect(rangeAttrs.style.width).toBe('50%');
  });

  it('defaults min=0, max=100', () => {
    const { thumbAttrs } = createSliderBehavior({ value: 25 });
    expect(thumbAttrs['aria-valuemin']).toBe(0);
    expect(thumbAttrs['aria-valuemax']).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

describe('createAccordionTriggerBehavior', () => {
  it('returns open state', () => {
    const { triggerAttrs } = createAccordionTriggerBehavior({ open: true });
    expect(triggerAttrs['aria-expanded']).toBe(true);
    expect(triggerAttrs['data-state']).toBe('open');
  });

  it('returns closed state', () => {
    const { triggerAttrs } = createAccordionTriggerBehavior({ open: false });
    expect(triggerAttrs['aria-expanded']).toBe(false);
    expect(triggerAttrs['data-state']).toBe('closed');
  });
});

describe('createAccordionContentBehavior', () => {
  it('returns open data-state', () => {
    const { contentAttrs } = createAccordionContentBehavior({ open: true });
    expect(contentAttrs['data-state']).toBe('open');
  });
});

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

describe('createPopoverBehavior', () => {
  it('returns closed state by default', () => {
    const { triggerAttrs, contentAttrs } = createPopoverBehavior();
    expect(triggerAttrs['aria-haspopup']).toBe('dialog');
    expect(triggerAttrs['data-state']).toBe('closed');
    expect(contentAttrs['data-state']).toBe('closed');
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
});
