<template>
  <div class="ui-density-comfortable" style="min-height: 100vh;">
    <header class="ucl-layout-header">
      <div>
        <h1 style="font-size: var(--ucl-text-xl); font-weight: 600; margin: 0;">
          Universal Core — Vue Demo
        </h1>
        <p class="ucl-text ucl-text-sm ucl-text-muted" style="margin-top: 0.25rem;">
          Tokens + styles + behaviors, no React.
        </p>
      </div>
      <div class="ucl-cluster ucl-cluster--sm">
        <button class="ucl-button ucl-button--outline ucl-button--sm" @click="setTheme('light')">
          Light
        </button>
        <button class="ucl-button ucl-button--outline ucl-button--sm" @click="setTheme('dark')">
          Dark
        </button>
        <button class="ucl-button ucl-button--ghost ucl-button--sm" @click="setTheme('system')">
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
              v-bind="switchBehavior.rootAttrs"
              @click="checked = !checked"
            >
              <span class="ucl-switch-thumb" v-bind="switchBehavior.thumbAttrs"></span>
            </button>
            <span class="ucl-text ucl-text-sm">
              Checked: <span class="ucl-code">{{ checked }}</span>
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
              v-bind="tabOverview.triggerAttrs"
              @click="activeTab = 'overview'"
            >
              Overview
            </button>
            <button
              type="button"
              class="ucl-tabs-trigger"
              v-bind="tabDetails.triggerAttrs"
              @click="activeTab = 'details'"
            >
              Details
            </button>
          </div>
          <div class="ucl-tabs-content" v-bind="panelOverview.contentAttrs">
            <p class="ucl-text ucl-text-sm">Overview panel — controlled by behaviors.</p>
          </div>
          <div class="ucl-tabs-content" v-bind="panelDetails.contentAttrs">
            <p class="ucl-text ucl-text-sm">Details panel — controlled by behaviors.</p>
          </div>
        </div>

        <div class="ucl-card">
          <h2 class="ucl-text ucl-text--lg" style="font-weight: 600; margin-bottom: 0.5rem;">
            Field behavior
          </h2>
          <div v-bind="fieldBehavior.fieldAttrs" class="ucl-stack ucl-stack--xs" style="max-width: 28rem;">
            <label class="ucl-field-label" v-bind="fieldBehavior.labelAttrs">Project name</label>
            <input
              class="ucl-input"
              v-bind="fieldBehavior.inputAttrs"
              :value="name"
              @input="onInput"
              placeholder="Aurora Dashboard"
            />
            <p id="name-desc" class="ucl-field-hint">Used in navigation and page titles.</p>
            <p v-if="hasError" id="name-err" class="ucl-field-error">Name is required.</p>
            <div class="ucl-cluster ucl-cluster--sm" style="margin-top: 0.5rem;">
              <button class="ucl-button ucl-button--outline ucl-button--sm" @click="hasError = !hasError">
                Toggle error
              </button>
              <button class="ucl-button ucl-button--ghost ucl-button--sm" @click="name = ''">
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { createFieldBehavior } from '@ui-construction-library/behaviors';
import {
  createSwitchBehavior,
  createTabContentBehavior,
  createTabTriggerBehavior,
} from '@ui-construction-library/behaviors';
import { computed, ref } from 'vue';

type ThemeMode = 'light' | 'dark' | 'system';
type TabValue = 'overview' | 'details';

const checked = ref(false);
const activeTab = ref<TabValue>('overview');
const name = ref('');
const hasError = ref(false);

function setTheme(mode: ThemeMode) {
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-theme');
    return;
  }
  document.documentElement.setAttribute('data-theme', mode);
}

const switchBehavior = computed(() =>
  createSwitchBehavior({ checked: checked.value })
);

const tabOverview = computed(() =>
  createTabTriggerBehavior({ value: activeTab.value, tabValue: 'overview' })
);
const tabDetails = computed(() =>
  createTabTriggerBehavior({ value: activeTab.value, tabValue: 'details' })
);
const panelOverview = computed(() =>
  createTabContentBehavior({ value: activeTab.value, tabValue: 'overview' })
);
const panelDetails = computed(() =>
  createTabContentBehavior({ value: activeTab.value, tabValue: 'details' })
);

const fieldBehavior = computed(() =>
  createFieldBehavior({
    fieldId: 'name',
    descriptionId: 'name-desc',
    errorId: 'name-err',
    hasError: hasError.value,
    required: true,
  })
);

function onInput(e: Event) {
  name.value = (e.target as HTMLInputElement).value;
}
</script>
