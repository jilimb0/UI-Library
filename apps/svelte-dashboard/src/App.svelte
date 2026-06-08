<script lang="ts">
  import {
    createSwitchBehavior,
    createTabContentBehavior,
    createTabTriggerBehavior,
  } from '@ui-construction-library/behaviors';

  type ThemeMode = 'light' | 'dark' | 'system';
  type TabValue = 'overview' | 'details';

  let checked = false;
  let activeTab: TabValue = 'overview';

  function setTheme(mode: ThemeMode) {
    if (mode === 'system') {
      document.documentElement.removeAttribute('data-theme');
      return;
    }
    document.documentElement.setAttribute('data-theme', mode);
  }

  $: switchBehavior = createSwitchBehavior({ checked });

  $: tabOverview = createTabTriggerBehavior({ value: activeTab, tabValue: 'overview' });
  $: tabDetails = createTabTriggerBehavior({ value: activeTab, tabValue: 'details' });
  $: panelOverview = createTabContentBehavior({ value: activeTab, tabValue: 'overview' });
  $: panelDetails = createTabContentBehavior({ value: activeTab, tabValue: 'details' });
</script>

<div class="ui-density-comfortable" style="min-height: 100vh;">
  <header class="ucl-layout-header">
    <div>
      <h1 style="font-size: var(--ucl-text-xl); font-weight: 600; margin: 0;">
        Universal Core — Svelte Demo
      </h1>
      <p class="ucl-text ucl-text-sm ucl-text-muted" style="margin-top: 0.25rem;">
        Tokens + styles + behaviors, no React.
      </p>
    </div>
    <div class="ucl-cluster ucl-cluster--sm">
      <button class="ucl-button ucl-button--outline ucl-button--sm" on:click={() => setTheme('light')}>
        Light
      </button>
      <button class="ucl-button ucl-button--outline ucl-button--sm" on:click={() => setTheme('dark')}>
        Dark
      </button>
      <button class="ucl-button ucl-button--ghost ucl-button--sm" on:click={() => setTheme('system')}>
        System
      </button>
    </div>
  </header>

  <main style="padding: 2rem; max-width: 56rem; margin: 0 auto;">
    <section class="ucl-stack ucl-stack--md">
      <div class="ucl-card">
        <h2 class="ucl-text ucl-text--lg" style="font-weight: 600; margin-bottom: 0.5rem;">
          Switch behavior
        </h2>
        <div class="ucl-cluster ucl-cluster--md" style="align-items: center;">
          <button
            type="button"
            class="ucl-switch ucl-switch--md"
            {...switchBehavior.rootAttrs}
            on:click={() => (checked = !checked)}
          >
            <span class="ucl-switch-thumb" {...switchBehavior.thumbAttrs}></span>
          </button>
          <span class="ucl-text ucl-text-sm">
            Checked: <span class="ucl-code">{String(checked)}</span>
          </span>
        </div>
      </div>

      <div class="ucl-card">
        <h2 class="ucl-text ucl-text--lg" style="font-weight: 600; margin-bottom: 0.5rem;">
          Tabs behavior
        </h2>
        <div class="ucl-tabs-list" role="tablist">
          <button
            type="button"
            class="ucl-tabs-trigger"
            {...tabOverview.triggerAttrs}
            on:click={() => (activeTab = 'overview')}
          >
            Overview
          </button>
          <button
            type="button"
            class="ucl-tabs-trigger"
            {...tabDetails.triggerAttrs}
            on:click={() => (activeTab = 'details')}
          >
            Details
          </button>
        </div>
        <div class="ucl-tabs-content" {...panelOverview.contentAttrs}>
          <p class="ucl-text ucl-text-sm">Overview panel — controlled by behaviors.</p>
        </div>
        <div class="ucl-tabs-content" {...panelDetails.contentAttrs}>
          <p class="ucl-text ucl-text-sm">Details panel — controlled by behaviors.</p>
        </div>
      </div>
    </section>
  </main>
</div>
