import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import {
  createAccordionContentBehavior,
  createAccordionTriggerBehavior,
} from '../accordion';
import { createButtonBehavior } from '../button';
import { createCheckboxBehavior } from '../checkbox';
import { cx } from '../cx';
import { createDialogBehavior } from '../dialog';
import { createFieldBehavior } from '../field';
import { createMenuBehavior, createMenuItemBehavior } from '../menu';
import { createPopoverBehavior } from '../popover';
import { createSelectBehavior, createSelectOptionBehavior } from '../select';
import { createSliderBehavior } from '../slider';
import { createSwitchBehavior } from '../switch';
import {
  createTabContentBehavior,
  createTabListBehavior,
  createTabTriggerBehavior,
} from '../tabs';
import { createTooltipBehavior } from '../tooltip';

const codeBox: CSSProperties = {
  background: '#f5f5f5',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  padding: 12,
  fontFamily: 'monospace',
  fontSize: 12,
  whiteSpace: 'pre-wrap',
  marginTop: 8,
};

function ARIAOutput({ attrs }: { attrs: Record<string, unknown> }) {
  return (
    <details>
      <summary style={{ cursor: 'pointer', fontSize: 12, color: '#666' }}>
        ARIA attributes
      </summary>
      <pre style={codeBox}>{JSON.stringify(attrs, null, 2)}</pre>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

function DemoButton({
  variant = 'default',
  loading = false,
  disabled = false,
}: {
  variant?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const behavior = createButtonBehavior({
    variant: variant as Parameters<typeof createButtonBehavior>[0]['variant'],
    loading,
    disabled,
  });
  return (
    <div>
      <button
        type="button"
        className={behavior.className}
        {...behavior.attrs}
        onClick={() => alert('Clicked!')}
        style={{
          padding: '8px 16px',
          borderRadius: 6,
          border: '1px solid #ccc',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {loading ? 'Loading...' : 'Button'}
      </button>
      <ARIAOutput
        attrs={{ ...behavior.attrs, className: behavior.className }}
      />
    </div>
  );
}

const ButtonMeta: Meta = {
  title: 'Behaviors/createButtonBehavior',
  tags: ['autodocs'],
};

export default ButtonMeta;

export const ButtonDefault: StoryObj = {
  name: 'Default',
  render: () => <DemoButton />,
};

export const ButtonSecondary: StoryObj = {
  name: 'Secondary',
  render: () => <DemoButton variant="secondary" />,
};

export const ButtonDestructive: StoryObj = {
  name: 'Destructive',
  render: () => <DemoButton variant="destructive" />,
};

export const ButtonOutline: StoryObj = {
  name: 'Outline',
  render: () => <DemoButton variant="outline" />,
};

export const ButtonGhost: StoryObj = {
  name: 'Ghost',
  render: () => <DemoButton variant="ghost" />,
};

export const ButtonLink: StoryObj = {
  name: 'Link',
  render: () => <DemoButton variant="link" />,
};

export const ButtonLoading: StoryObj = {
  name: 'Loading',
  render: () => <DemoButton loading />,
};

export const ButtonDisabled: StoryObj = {
  name: 'Disabled',
  render: () => <DemoButton disabled />,
};

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

export const DialogBehavior: StoryObj = {
  name: 'createDialogBehavior',
  render: () => {
    const behavior = createDialogBehavior({
      open: true,
      titleId: 'title-1',
      descriptionId: 'desc-1',
    });
    return (
      <div>
        <p style={{ fontSize: 14, marginBottom: 8 }}>
          Output for <code>open=true</code>:
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  textAlign: 'left',
                }}
              >
                Property
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  textAlign: 'left',
                }}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  fontFamily: 'monospace',
                }}
              >
                triggerAttrs
              </td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(behavior.triggerAttrs, null, 2)}
                </pre>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  fontFamily: 'monospace',
                }}
              >
                overlayAttrs
              </td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(behavior.overlayAttrs, null, 2)}
                </pre>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  fontFamily: 'monospace',
                }}
              >
                contentAttrs
              </td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(behavior.contentAttrs, null, 2)}
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

export const SwitchBehavior: StoryObj = {
  name: 'createSwitchBehavior',
  render: () => {
    const checked = createSwitchBehavior({ checked: true });
    const unchecked = createSwitchBehavior({ checked: false });
    return (
      <div>
        <p style={{ fontSize: 14, marginBottom: 8 }}>
          Toggle between <strong>checked</strong> and <strong>unchecked</strong>{' '}
          states:
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <p style={{ fontWeight: 600 }}>Checked</p>
            <pre style={codeBox}>
              {JSON.stringify(checked.rootAttrs, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontWeight: 600 }}>Unchecked</p>
            <pre style={codeBox}>
              {JSON.stringify(unchecked.rootAttrs, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

export const SliderBehavior: StoryObj = {
  name: 'createSliderBehavior',
  render: () => {
    const slider = createSliderBehavior({ value: 42, min: 0, max: 100 });
    return (
      <div>
        <p style={{ fontSize: 14, marginBottom: 8 }}>
          Slider at value <strong>42</strong> (0–100):
        </p>
        <pre style={codeBox}>
          {JSON.stringify(
            { thumbAttrs: slider.thumbAttrs, rangeAttrs: slider.rangeAttrs },
            null,
            2
          )}
        </pre>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function DemoTabs() {
  const list = createTabListBehavior();
  const tab1 = createTabTriggerBehavior({ value: 'tab1', tabValue: 'tab1' });
  const tab2 = createTabTriggerBehavior({ value: 'tab1', tabValue: 'tab2' });
  const content1 = createTabContentBehavior({
    value: 'tab1',
    tabValue: 'tab1',
  });
  const content2 = createTabContentBehavior({
    value: 'tab1',
    tabValue: 'tab2',
  });

  return (
    <div>
      <div {...list.listAttrs} style={{ display: 'flex', gap: 4 }}>
        <button
          type="button"
          {...tab1.triggerAttrs}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #1976d2',
          }}
        >
          Tab 1 (active)
        </button>
        <button
          type="button"
          {...tab2.triggerAttrs}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        >
          Tab 2 (inactive)
        </button>
      </div>
      <div
        {...content1.contentAttrs}
        style={{ padding: 12, border: '1px solid #ddd', marginTop: 4 }}
      >
        Tab 1 content
      </div>
      {content2.contentAttrs.hidden ? null : (
        <div
          {...content2.contentAttrs}
          style={{ padding: 12, border: '1px solid #ddd', marginTop: 4 }}
        >
          Tab 2 content
        </div>
      )}
    </div>
  );
}

export const TabsBehavior: StoryObj = {
  name: 'createTab*Behavior',
  render: () => <DemoTabs />,
};

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

export const PopoverBehavior: StoryObj = {
  name: 'createPopoverBehavior',
  render: () => {
    const open = createPopoverBehavior({ open: true });
    const closed = createPopoverBehavior({ open: false });
    return (
      <div style={{ display: 'flex', gap: 32 }}>
        <div>
          <p style={{ fontWeight: 600 }}>Open</p>
          <pre style={codeBox}>
            {JSON.stringify(open.triggerAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Closed</p>
          <pre style={codeBox}>
            {JSON.stringify(closed.triggerAttrs, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

function DemoCheckbox({
  checked = false,
  indeterminate = false,
}: {
  checked?: boolean;
  indeterminate?: boolean;
}) {
  const behavior = createCheckboxBehavior({ checked, indeterminate });
  return (
    <div>
      {/* biome-ignore lint/a11y/useSemanticElements: story demo of checkbox behavior */}
      <div
        role="checkbox"
        aria-checked={behavior.checkboxAttrs['aria-checked']}
        tabIndex={0}
        style={{
          width: 24,
          height: 24,
          border: '2px solid #1976d2',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: checked ? '#1976d2' : 'transparent',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {indeterminate ? '-' : checked ? '✓' : ''}
      </div>
      <ARIAOutput
        attrs={{
          ...behavior.checkboxAttrs,
          className: behavior.checkboxClassName,
        }}
      />
    </div>
  );
}

export const CheckboxDefault: StoryObj = {
  name: 'createCheckboxBehavior (default)',
  render: () => <DemoCheckbox />,
};

export const CheckboxChecked: StoryObj = {
  name: 'createCheckboxBehavior (checked)',
  render: () => <DemoCheckbox checked />,
};

export const CheckboxIndeterminate: StoryObj = {
  name: 'createCheckboxBehavior (indeterminate)',
  render: () => <DemoCheckbox indeterminate />,
};

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export const TooltipBehavior: StoryObj = {
  name: 'createTooltipBehavior',
  render: () => {
    const behavior = createTooltipBehavior({ open: true, tooltipId: 'tip-1' });
    return (
      <div>
        <p style={{ fontSize: 14, marginBottom: 8 }}>
          <code>
            createTooltipBehavior({'{'} open: true {'}'})
          </code>{' '}
          output:
        </p>
        <pre style={codeBox}>
          {JSON.stringify(
            {
              triggerAttrs: behavior.triggerAttrs,
              tooltipAttrs: behavior.tooltipAttrs,
              triggerClassName: behavior.triggerClassName,
              tooltipClassName: behavior.tooltipClassName,
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

export const MenuBehavior: StoryObj = {
  name: 'createMenuBehavior',
  render: () => {
    const menu = createMenuBehavior({ open: true, menuId: 'menu-1' });
    const item1 = createMenuItemBehavior({ onClick: () => alert('Item 1') });
    const item2 = createMenuItemBehavior({ disabled: true });
    return (
      <div>
        <p style={{ fontSize: 14, marginBottom: 8 }}>
          Menu items with ARIA attributes:
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <p style={{ fontWeight: 600 }}>Menu attrs:</p>
            <pre style={codeBox}>{JSON.stringify(menu.menuAttrs, null, 2)}</pre>
          </div>
          <div>
            <p style={{ fontWeight: 600 }}>Active item:</p>
            <pre style={codeBox}>
              {JSON.stringify(item1.itemAttrs, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontWeight: 600 }}>Disabled item:</p>
            <pre style={codeBox}>
              {JSON.stringify(item2.itemAttrs, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export const SelectBehavior: StoryObj = {
  name: 'createSelectBehavior',
  render: () => {
    const openSelect = createSelectBehavior({ open: true, value: 'option-1' });
    const closedSelect = createSelectBehavior({
      open: false,
      value: 'option-1',
    });
    const optionSelected = createSelectOptionBehavior({
      value: 'option-1',
      selectedValue: 'option-1',
    });
    const optionUnselected = createSelectOptionBehavior({
      value: 'option-2',
      selectedValue: 'option-1',
    });
    return (
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontWeight: 600 }}>Select trigger (open)</p>
          <pre style={codeBox}>
            {JSON.stringify(openSelect.triggerAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Select trigger (closed)</p>
          <pre style={codeBox}>
            {JSON.stringify(closedSelect.triggerAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Option (selected)</p>
          <pre style={codeBox}>
            {JSON.stringify(optionSelected.optionAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Option (unselected)</p>
          <pre style={codeBox}>
            {JSON.stringify(optionUnselected.optionAttrs, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export const AccordionBehavior: StoryObj = {
  name: 'createAccordion*Behavior',
  render: () => {
    const triggerOpen = createAccordionTriggerBehavior({
      open: true,
      onToggle: () => {},
    });
    const triggerClosed = createAccordionTriggerBehavior({
      open: false,
      onToggle: () => {},
    });
    const contentOpen = createAccordionContentBehavior({ open: true });
    const contentClosed = createAccordionContentBehavior({ open: false });
    return (
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontWeight: 600 }}>Trigger (open)</p>
          <pre style={codeBox}>
            {JSON.stringify(triggerOpen.triggerAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Trigger (closed)</p>
          <pre style={codeBox}>
            {JSON.stringify(triggerClosed.triggerAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Content (open)</p>
          <pre style={codeBox}>
            {JSON.stringify(contentOpen.contentAttrs, null, 2)}
          </pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Content (closed)</p>
          <pre style={codeBox}>
            {JSON.stringify(contentClosed.contentAttrs, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

export const FieldBehavior: StoryObj = {
  name: 'createFieldBehavior',
  render: () => {
    const field = createFieldBehavior({
      fieldId: 'email',
      descriptionId: 'email-desc',
      errorId: 'email-error',
      hasError: false,
    });
    const fieldError = createFieldBehavior({
      fieldId: 'email',
      descriptionId: 'email-desc',
      errorId: 'email-error',
      hasError: true,
    });
    return (
      <div style={{ display: 'flex', gap: 32 }}>
        <div>
          <p style={{ fontWeight: 600 }}>Normal field</p>
          <pre style={codeBox}>{JSON.stringify(field.inputAttrs, null, 2)}</pre>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Error field</p>
          <pre style={codeBox}>
            {JSON.stringify(fieldError.inputAttrs, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// focusTrap
// ---------------------------------------------------------------------------

function DemoFocusTrap() {
  return (
    <div>
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        <code>getFocusableElements</code> and <code>trapFocus</code> are DOM
        utilities:
      </p>
      <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
        <p style={{ fontSize: 13, marginBottom: 8 }}>
          The following HTML elements are focusable:
        </p>
        <div
          id="focus-trap-demo"
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <input type="text" placeholder="Text input" />
          <button type="button" onClick={() => alert('Button clicked')}>
            Button
          </button>
          <button type="button" onClick={(e) => e.preventDefault()}>
            Link
          </button>
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          <textarea placeholder="Textarea" rows={2} />
        </div>
      </div>
    </div>
  );
}

export const FocusTrap: StoryObj = {
  name: 'getFocusableElements / trapFocus',
  render: () => <DemoFocusTrap />,
};

// ---------------------------------------------------------------------------
// cx
// ---------------------------------------------------------------------------

export const CxUtility: StoryObj = {
  name: 'cx',
  render: () => (
    <div>
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        <code>cx(...classes)</code> filters falsy values and joins with space:
      </p>
      <pre style={codeBox}>
        {`cx('base', 'active', false && 'hidden', null, 'visible')
// => "${cx('base', 'active', false && 'hidden', null, 'visible')}"`}
      </pre>
    </div>
  ),
};
