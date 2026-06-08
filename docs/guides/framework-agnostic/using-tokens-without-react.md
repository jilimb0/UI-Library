# Using Tokens Without React

The `@ui-construction-library/tokens` package is 100% framework-agnostic.
It ships design tokens as TypeScript objects, JSON files, CSS custom properties,
and a Tailwind preset — none of which require React.

---

## Installation

```bash
npm install @ui-construction-library/tokens
```

---

## CSS Custom Properties (any framework)

The tokens package generates CSS custom properties with the `--ucl-` namespace.
Import them in your stylesheet or HTML:

```html
<link rel="stylesheet" href="@ui-construction-library/tokens/css" />
```

Or in your CSS:

```css
@import '@ui-construction-library/tokens/css';

.my-component {
  background: var(--ucl-color-primary-500);
  color: var(--ucl-color-foreground);
  padding: var(--ucl-space-4);
  border-radius: var(--ucl-radius-md);
}
```

Both `--ucl-*` (canonical) and `--*` (legacy backward-compat) variable names are emitted.

---

## JSON Tokens (build tools, Figma plugins, Style Dictionary)

Import pre-built JSON token files without any JS bundler:

```js
// Node.js / build script
import rawTokens from '@ui-construction-library/tokens/json';
import semanticTokens from '@ui-construction-library/tokens/semantic';
import componentTokens from '@ui-construction-library/tokens/component';

console.log(rawTokens.color.primary[500]); // "#09090b"
console.log(semanticTokens.light.background); // "#ffffff"
```

---

## TypeScript Objects (Vue, Svelte, Angular, vanilla)

Import token objects directly in any TS/JS project:

```ts
import { colors, spacing, typography, borderRadius } from '@ui-construction-library/tokens';

// Use in Vue reactive state
const theme = reactive({
  primaryColor: colors.primary[500],
  baseSpacing: spacing[4],
  bodyFont: typography.fontFamily.sans,
});
```

---

## Vue Example

```vue
<template>
  <div :style="{ background: primaryColor, padding: baseSpacing }">
    Themed with UCL tokens
  </div>
</template>

<script setup lang="ts">
import { colors, spacing } from '@ui-construction-library/tokens';

const primaryColor = colors.primary[500];
const baseSpacing = spacing[4];
</script>
```

---

## Svelte Example

```svelte
<script>
  import { colors, spacing } from '@ui-construction-library/tokens';
</script>

<div style="background: {colors.primary[500]}; padding: {spacing[4]}">
  Themed with UCL tokens
</div>
```

---

## Tailwind Preset

The Tailwind preset mirrors all token categories and works in any Tailwind project:

```js
// tailwind.config.js
export default {
  presets: [require('@ui-construction-library/tokens/tailwind.preset')],
};
```

This gives you `bg-primary-500`, `text-foreground`, `rounded-md`, `shadow-lg`,
`font-sans`, etc. — all derived from the same token source.
