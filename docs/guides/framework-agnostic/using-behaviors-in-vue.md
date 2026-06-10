# Using Behaviors in Vue

The `@ui-construction-library/behaviors` package contains pure JS behavior
factories with zero framework dependencies. They return attribute objects
that you can spread onto any element in any framework.

---

## Installation

```bash
npm install @ui-construction-library/behaviors
```

---

## How Behaviors Work

Each behavior factory returns an object with `attrs` properties containing
ARIA roles, `data-state` attributes, and other accessibility metadata:

```ts
import { createSwitchBehavior } from '@ui-construction-library/behaviors';

const behavior = createSwitchBehavior({ checked: true, disabled: false });
// Returns:
// {
//   rootAttrs: { role: 'switch', 'aria-checked': true, 'data-state': 'checked', disabled: false },
//   thumbAttrs: { 'data-state': 'checked' }
// }
```

---

## Vue 3 Example: Toggle Switch

```vue
<template>
  <button
    type="button"
    v-bind="behavior.rootAttrs"
    class="ucl-switch ucl-switch--md"
    @click="toggle"
  >
    <span class="ucl-switch-thumb" v-bind="behavior.thumbAttrs"></span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { createSwitchBehavior } from '@ui-construction-library/behaviors';

const checked = ref(false);
const behavior = computed(() =>
  createSwitchBehavior({ checked: checked.value })
);

function toggle() {
  checked.value = !checked.value;
}
</script>
```

---

## Vue 3 Example: Dialog

```vue
<template>
  <div v-if="open" class="ucl-modal-backdrop" v-bind="behavior.overlayAttrs" @click="close">
    <div class="ucl-modal-content" v-bind="behavior.contentAttrs" @click.stop>
      <h2 v-bind="behavior.titleAttrs" class="ucl-modal-title">{{ title }}</h2>
      <slot />
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { createDialogBehavior } from '@ui-construction-library/behaviors';

const props = defineProps<{ title: string }>();
const open = ref(false);
const behavior = computed(() => createDialogBehavior({ open: open.value }));

function close() { open.value = false; }
defineExpose({ open: () => (open.value = true) });
</script>
```

---

## Vue 3 Example: Tabs

```vue
<template>
  <div class="ucl-tabs-list" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      v-bind="getTriggerBehavior(tab.value).triggerAttrs"
      class="ucl-tabs-trigger"
      @click="activeTab = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
  <div
    v-for="tab in tabs"
    :key="tab.value"
    v-bind="getContentBehavior(tab.value).contentAttrs"
    class="ucl-tabs-content"
  >
    <slot :name="tab.value" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTabTriggerBehavior, createTabContentBehavior } from '@ui-construction-library/behaviors';

const tabs = [
  { value: 'tab1', label: 'Overview' },
  { value: 'tab2', label: 'Details' },
];
const activeTab = ref('tab1');

function getTriggerBehavior(tabValue: string) {
  return createTabTriggerBehavior({ value: activeTab.value, tabValue });
}
function getContentBehavior(tabValue: string) {
  return createTabContentBehavior({ value: activeTab.value, tabValue });
}
</script>
```

---

## Available Behaviors

| Factory | Returns | Use case |
|---------|---------|----------|
| `createButtonBehavior(opts)` | `{ attrs }` | Button with disabled/loading states |
| `createSwitchBehavior(opts)` | `{ rootAttrs, thumbAttrs }` | Toggle switch |
| `createDialogBehavior(opts)` | `{ overlayAttrs, contentAttrs, titleAttrs, descriptionAttrs }` | Modal dialog |
| `createTabTriggerBehavior(opts)` | `{ triggerAttrs }` | Tab button |
| `createTabContentBehavior(opts)` | `{ contentAttrs }` | Tab panel |
| `createFieldBehavior(opts)` | `{ fieldAttrs, labelAttrs, inputAttrs }` | Form field with label/error wiring |
| `createSliderBehavior(opts)` | `{ rootAttrs, trackAttrs, rangeAttrs, thumbAttrs }` | Range slider |
| `createAccordionTriggerBehavior(opts)` | `{ triggerAttrs }` | Accordion header |
| `createAccordionContentBehavior(opts)` | `{ contentAttrs }` | Accordion panel |
| `createPopoverBehavior(opts)` | `{ triggerAttrs, contentAttrs }` | Popover/dropdown |

All factories are pure functions — no side effects, no DOM access, no framework imports.
