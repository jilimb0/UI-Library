# Using Styles Without React

The `@ui-construction-library/styles` package provides a universal CSS layer
that works in any framework — or with no framework at all.

---

## Installation

```bash
npm install @ui-construction-library/styles
```

---

## Import the Stylesheet

### In HTML

```html
<link rel="stylesheet" href="@ui-construction-library/styles/styles.css" />
```

### In CSS

```css
@import '@ui-construction-library/styles/styles.css';
```

### In JS (bundler-based import)

```ts
import '@ui-construction-library/styles/styles.css';
```

---

## What You Get

The single `styles.css` file includes:

1. **Base layer** — CSS reset, semantic token aliases (`--ucl-*`), typography defaults, dark theme
2. **Component layer** — Pre-built classes for common UI patterns
3. **Utilities layer** — Density presets, spacing helpers, layout utilities

---

## Component Classes

All component classes use the `ucl-` prefix. Unprefixed legacy names also work.

```html
<!-- Button variants -->
<button class="ucl-button ucl-button--default">Primary</button>
<button class="ucl-button ucl-button--outline">Outline</button>
<button class="ucl-button ucl-button--ghost">Ghost</button>

<!-- Form controls -->
<input class="ucl-input" type="text" placeholder="Enter text..." />
<select class="ucl-select">...</select>
<textarea class="ucl-textarea"></textarea>

<!-- Cards & badges -->
<div class="ucl-card">
  <h3 class="ucl-text ucl-text--lg">Card Title</h3>
  <p class="ucl-text">Card content here.</p>
</div>

<span class="ucl-badge ucl-badge--success">Active</span>
<span class="ucl-badge ucl-badge--error">Error</span>

<!-- Toggle switch -->
<button class="ucl-switch ucl-switch--md" role="switch" data-state="unchecked">
  <span class="ucl-switch-thumb"></span>
</button>

<!-- Tabs -->
<div class="ucl-tabs-list">
  <button class="ucl-tabs-trigger" data-state="active">Tab 1</button>
  <button class="ucl-tabs-trigger" data-state="inactive">Tab 2</button>
</div>
<div class="ucl-tabs-content">Tab 1 content</div>
```

---

## Density Presets

Apply density to any container:

```html
<div class="ui-density-comfortable">
  <!-- Spacious spacing, standard input heights -->
</div>

<div class="ui-density-compact">
  <!-- Tighter spacing, smaller inputs -->
</div>
```

---

## Utility Classes

```html
<!-- Stacks (vertical flex) -->
<div class="ucl-stack ucl-stack--md">...</div>

<!-- Clusters (horizontal flex-wrap) -->
<div class="ucl-cluster ucl-cluster--sm">...</div>

<!-- Padding / margin -->
<div class="ucl-p-4">1rem padding</div>
<div class="ucl-mt-6">1.5rem top margin</div>

<!-- Text -->
<p class="ucl-text-sm ucl-text-muted">Small muted text</p>

<!-- Surfaces -->
<div class="ucl-surface ucl-surface--elevated">Elevated card</div>

<!-- Accessibility -->
<span class="ucl-sr-only">Screen reader only text</span>
```

---

## Dark Theme

The stylesheet respects `prefers-color-scheme: dark` automatically.
You can also force a theme via the `data-theme` attribute:

```html
<html data-theme="dark">
  <!-- Dark theme active -->
</html>

<html data-theme="light">
  <!-- Light theme forced -->
</html>
```

---

## Vue Example

```vue
<template>
  <div>
    <button class="ucl-button ucl-button--default" @click="count++">
      Count: {{ count }}
    </button>
    <div class="ucl-card ucl-mt-4">
      <p class="ucl-text">Vue works seamlessly with UCL CSS classes.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@ui-construction-library/styles/styles.css';

const count = ref(0);
</script>
```

---

## Svelte Example

```svelte
<script>
  import '@ui-construction-library/styles/styles.css';
</script>

<button class="ucl-button ucl-button--default" on:click={() => alert('Hello!')}>
  Svelte + UCL Styles
</button>

<div class="ucl-card ucl-mt-4">
  <p class="ucl-text">No framework lock-in required.</p>
</div>
```
