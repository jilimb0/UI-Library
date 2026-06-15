import {
  createButtonBehavior,
  createCheckboxBehavior,
  createSwitchBehavior,
  createTabContentBehavior,
  createTabListBehavior,
  createTabTriggerBehavior,
} from '@ui-construction-library/behaviors';

// ---------------------------------------------------------------------------
// Button Demo
// ---------------------------------------------------------------------------

const buttons = [
  { id: 'btn-default', variant: 'default', size: 'default' },
  { id: 'btn-destructive', variant: 'destructive', size: 'default' },
  { id: 'btn-disabled', variant: 'default', size: 'default', disabled: true },
  { id: 'btn-loading', variant: 'default', size: 'default', loading: true },
];

buttons.forEach(({ id, variant, size, disabled, loading }) => {
  const el = document.getElementById(id);
  if (!el) return;

  const { attrs, className, handlers } = createButtonBehavior({
    variant,
    size,
    disabled,
    loading,
    onClick: (e) => {
      console.log(`Button ${id} clicked`, e);
    },
  });

  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) el.setAttribute(k, String(v));
  });
  el.className = className;
  el.addEventListener('click', handlers.onClick);
  el.addEventListener('keydown', handlers.onKeyDown);
});

// ---------------------------------------------------------------------------
// Switch Demo
// ---------------------------------------------------------------------------

const switchEl = document.getElementById('switch-demo');
const switchLabel = document.getElementById('switch-label');

if (switchEl && switchLabel) {
  let checked = false;

  const applySwitch = () => {
    const { rootAttrs, rootClassName, thumbClassName, handlers } =
      createSwitchBehavior({
        checked,
        onCheckedChange: (next) => {
          checked = next;
          switchLabel.textContent = `Feature is ${checked ? 'on' : 'off'}`;
          applySwitch();
        },
      });

    Object.entries(rootAttrs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) switchEl.setAttribute(k, String(v));
      else switchEl.removeAttribute(k);
    });
    switchEl.className = rootClassName;
    switchEl.innerHTML = `<span class="${thumbClassName}"></span>`;

    switchEl.addEventListener('click', handlers.onClick);
    switchEl.addEventListener('keydown', handlers.onKeyDown);
  };

  applySwitch();
}

// ---------------------------------------------------------------------------
// Checkbox Demo
// ---------------------------------------------------------------------------

const checkboxEl = document.getElementById('checkbox-demo');
const checkboxLabel = document.getElementById('checkbox-label');

if (checkboxEl && checkboxLabel) {
  let checked = false;

  const applyCheckbox = () => {
    const { checkboxAttrs, checkboxClassName, handlers } =
      createCheckboxBehavior({
        checked,
        onCheckedChange: (next) => {
          checked = next;
          checkboxLabel.textContent = checked
            ? 'Terms accepted'
            : 'Accept terms';
          applyCheckbox();
        },
      });

    Object.entries(checkboxAttrs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) checkboxEl.setAttribute(k, String(v));
      else checkboxEl.removeAttribute(k);
    });
    checkboxEl.className = checkboxClassName;

    checkboxEl.addEventListener('click', handlers.onClick);
    checkboxEl.addEventListener('keydown', handlers.onKeyDown);
  };

  applyCheckbox();
}

// ---------------------------------------------------------------------------
// Tabs Demo
// ---------------------------------------------------------------------------

const tabsList = document.getElementById('tabs-list');
const tabsContent = document.getElementById('tabs-content');

const tabs = [
  { value: 'overview', label: 'Overview', content: 'Overview content panel.' },
  { value: 'details', label: 'Details', content: 'Details content panel.' },
  { value: 'settings', label: 'Settings', content: 'Settings content panel.' },
];

let activeTab = 'overview';

const renderTabs = () => {
  if (!tabsList || !tabsContent) return;

  tabsList.innerHTML = '';
  tabsContent.innerHTML = '';

  const { listAttrs, listClassName } = createTabListBehavior();
  Object.entries(listAttrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) tabsList.setAttribute(k, String(v));
  });
  tabsList.className = listClassName;

  tabs.forEach((tab, index) => {
    const { triggerAttrs, className, handlers } = createTabTriggerBehavior({
      value: activeTab,
      tabValue: tab.value,
      onValueChange: (v) => {
        activeTab = v;
        renderTabs();
      },
      onNext: () => {
        activeTab = tabs[(index + 1) % tabs.length].value;
        renderTabs();
      },
      onPrev: () => {
        activeTab = tabs[(index - 1 + tabs.length) % tabs.length].value;
        renderTabs();
      },
    });

    const btn = document.createElement('button');
    Object.entries(triggerAttrs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) btn.setAttribute(k, String(v));
    });
    btn.className = className;
    btn.textContent = tab.label;
    btn.addEventListener('click', handlers.onClick);
    btn.addEventListener('keydown', handlers.onKeyDown);
    tabsList.appendChild(btn);

    const { contentAttrs, className: contentClassName } =
      createTabContentBehavior({
        value: activeTab,
        tabValue: tab.value,
      });

    const panel = document.createElement('div');
    Object.entries(contentAttrs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) panel.setAttribute(k, String(v));
    });
    panel.className = contentClassName;
    panel.textContent = tab.content;
    tabsContent.appendChild(panel);
  });
};

renderTabs();
