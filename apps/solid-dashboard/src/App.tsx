import {
  createSwitchBehavior,
  createTabContentBehavior,
  createTabTriggerBehavior,
} from '@ui-construction-library/behaviors';
import { createMemo, createSignal } from 'solid-js';

type ThemeMode = 'light' | 'dark' | 'system';

type TabValue = 'overview' | 'details';

const switchRole = 'switch' as const;
const tabRole = 'tab' as const;
const tabListRole = 'tablist' as const;
const tabPanelRole = 'tabpanel' as const;

export function App() {
  const [checked, setChecked] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal<TabValue>('overview');

  const switchBehavior = createMemo(() =>
    createSwitchBehavior({ checked: checked() })
  );

  const tabOverview = createMemo(() =>
    createTabTriggerBehavior({ value: activeTab(), tabValue: 'overview' })
  );
  const tabDetails = createMemo(() =>
    createTabTriggerBehavior({ value: activeTab(), tabValue: 'details' })
  );
  const panelOverview = createMemo(() =>
    createTabContentBehavior({ value: activeTab(), tabValue: 'overview' })
  );
  const panelDetails = createMemo(() =>
    createTabContentBehavior({ value: activeTab(), tabValue: 'details' })
  );

  const setTheme = (mode: ThemeMode) => {
    if (mode === 'system') {
      document.documentElement.removeAttribute('data-theme');
      return;
    }
    document.documentElement.setAttribute('data-theme', mode);
  };

  return (
    <div class="ui-density-comfortable" style={{ 'min-height': '100vh' }}>
      <header class="ucl-layout-header">
        <div>
          <h1
            style={{
              'font-size': 'var(--ucl-text-xl)',
              'font-weight': 600,
              margin: 0,
            }}
          >
            Universal Core — Solid Demo
          </h1>
          <p
            class="ucl-text ucl-text-sm ucl-text-muted"
            style={{ 'margin-top': '0.25rem' }}
          >
            Tokens + styles + behaviors, no React.
          </p>
        </div>
        <div class="ucl-cluster ucl-cluster--sm">
          <button
            type="button"
            class="ucl-button ucl-button--outline ucl-button--sm"
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            type="button"
            class="ucl-button ucl-button--outline ucl-button--sm"
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button
            type="button"
            class="ucl-button ucl-button--ghost ucl-button--sm"
            onClick={() => setTheme('system')}
          >
            System
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem', 'max-width': '56rem', margin: '0 auto' }}>
        <section class="ucl-stack ucl-stack--md">
          <div class="ucl-card">
            <h2
              class="ucl-text ucl-text--lg"
              style={{ 'font-weight': 600, 'margin-bottom': '0.5rem' }}
            >
              Switch behavior
            </h2>
            <div
              class="ucl-cluster ucl-cluster--md"
              style={{ 'align-items': 'center' }}
            >
              <button
                type="button"
                class="ucl-switch ucl-switch--md"
                {...switchBehavior().rootAttrs}
                role={switchRole}
                onClick={() => setChecked((v) => !v)}
              >
                <span
                  class="ucl-switch-thumb"
                  {...switchBehavior().thumbAttrs}
                />
              </button>
              <span class="ucl-text ucl-text-sm">
                Checked: <span class="ucl-code">{String(checked())}</span>
              </span>
            </div>
          </div>

          <div class="ucl-card">
            <h2
              class="ucl-text ucl-text--lg"
              style={{ 'font-weight': 600, 'margin-bottom': '0.5rem' }}
            >
              Tabs behavior
            </h2>
            <div class="ucl-tabs-list" role={tabListRole}>
              <button
                type="button"
                class="ucl-tabs-trigger"
                {...tabOverview().triggerAttrs}
                role={tabRole}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                class="ucl-tabs-trigger"
                {...tabDetails().triggerAttrs}
                role={tabRole}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
            </div>
            <div
              class="ucl-tabs-content"
              {...panelOverview().contentAttrs}
              role={tabPanelRole}
            >
              <p class="ucl-text ucl-text-sm">
                Overview panel — controlled by behaviors.
              </p>
            </div>
            <div
              class="ucl-tabs-content"
              {...panelDetails().contentAttrs}
              role={tabPanelRole}
            >
              <p class="ucl-text ucl-text-sm">
                Details panel — controlled by behaviors.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
