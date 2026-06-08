# Using Behaviors in Svelte

The `@ui-construction-library/behaviors` package contains pure JS behavior
factories with zero framework dependencies. In Svelte, you call them
reactively and spread the resulting attributes onto elements.

---

## Installation

```bash
npm install @ui-construction-library/behaviors @ui-construction-library/styles
```

---

## Svelte 5 Example: Toggle Switch

```svelte
<script lang="ts">
  import { createSwitchBehavior } from '@ui-construction-library/behaviors';

  let checked = $state(false);
  const behavior = $derived(createSwitchBehavior({ checked }));
</script>

<button
  type="button"
  {...behavior.rootAttrs}
  class="ucl-switch ucl-switch--md"
  onclick={() => (checked = !checked)}
>
  <span class="ucl-switch-thumb" {...behavior.thumbAttrs}></span>
</button>
```

---

## Svelte 5 Example: Accordion

```svelte
<script lang="ts">
  import {
    createAccordionTriggerBehavior,
    createAccordionContentBehavior,
  } from '@ui-construction-library/behaviors';

  interface Item {
    id: string;
    title: string;
    content: string;
  }

  let { items }: { items: Item[] } = $props();
  let openIds = $state<Set<string>>(new Set());

  function toggle(id: string) {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    openIds = next;
  }
</script>

{#each items as item (item.id)}
  {@const isOpen = openIds.has(item.id)}
  {@const triggerBehavior = createAccordionTriggerBehavior({ open: isOpen })}
  {@const contentBehavior = createAccordionContentBehavior({ open: isOpen })}

  <div class="ucl-accordion-item">
    <button
      class="ucl-accordion-trigger"
      {...triggerBehavior.triggerAttrs}
      onclick={() => toggle(item.id)}
    >
      {item.title}
    </button>
    {#if isOpen}
      <div class="ucl-accordion-content" {...contentBehavior.contentAttrs}>
        {item.content}
      </div>
    {/if}
  </div>
{/each}
```

---

## Svelte 5 Example: Form Field

```svelte
<script lang="ts">
  import { createFieldBehavior } from '@ui-construction-library/behaviors';

  let { fieldId = 'name', label = 'Name', error = '' }: {
    fieldId?: string;
    label?: string;
    error?: string;
  } = $props();

  let value = $state('');
  const behavior = $derived(
    createFieldBehavior({
      fieldId,
      hasError: error.length > 0,
      required: true,
    })
  );
</script>

<div {...behavior.fieldAttrs}>
  <label class="ucl-field-label" {...behavior.labelAttrs}>{label}</label>
  <input
    class="ucl-input"
    {...behavior.inputAttrs}
    bind:value
  />
  {#if error}
    <p class="ucl-field-hint ucl-text-error">{error}</p>
  {/if}
</div>
```

---

## Svelte 4 Example (Runes not available)

For Svelte 4 without runes, use reactive declarations:

```svelte
<script lang="ts">
  import { createSwitchBehavior } from '@ui-construction-library/behaviors';

  let checked = false;
  $: behavior = createSwitchBehavior({ checked });
</script>

<button
  type="button"
  {...behavior.rootAttrs}
  class="ucl-switch ucl-switch--md"
  on:click={() => (checked = !checked)}
>
  <span class="ucl-switch-thumb" {...behavior.thumbAttrs}></span>
</button>
```

---

## Combining with UCL Styles

Import the CSS once in your app entry:

```svelte
<!-- App.svelte -->
<script>
  import '@ui-construction-library/styles/styles.css';
</script>

<main class="ui-density-comfortable">
  <slot />
</main>
```

All `ucl-*` classes from the styles package work out of the box, and the
behavior factories ensure correct ARIA attributes are always applied.

---

## Available Behaviors

| Factory | Use case |
|---------|----------|
| `createButtonBehavior` | Button disabled/loading states |
| `createSwitchBehavior` | Toggle switch |
| `createDialogBehavior` | Modal dialog |
| `createTabTriggerBehavior` / `createTabContentBehavior` | Tabs |
| `createFieldBehavior` | Form field ARIA wiring |
| `createSliderBehavior` | Range slider |
| `createAccordionTriggerBehavior` / `createAccordionContentBehavior` | Accordion |
| `createPopoverBehavior` | Popover/dropdown |

All factories are pure functions — no side effects, no DOM access, no framework imports.
