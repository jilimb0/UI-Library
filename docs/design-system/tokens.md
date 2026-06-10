# Design Tokens

The `@ui-construction-library/tokens` package provides a three-tier token hierarchy that drives all visual decisions across the component library.

---

## Token Tiers

### Tier 1: Primitive Tokens

Raw values — color scales, spacing values, typography scales, border radii, shadows, motion durations, and z-index layers.

| Module | CSS variable prefix | Example |
|---|---|---|
| `colors` | `--color-{scale}-{tone}` | `--color-primary-500: #71717a` |
| `spacing` | `--space-{key}` | `--space-4: 1rem` |
| `typography` | `--font-{key}`, `--text-{key}`, `--font-weight-{key}` | `--font-body: 'Inter', sans-serif` |
| `borders` | `--radius-{key}` | `--radius-md: 0.375rem` |
| `shadows` | `--shadow-{key}` | `--shadow-md: 0 4px 6px ...` |
| `motion` | `--motion-duration-{key}`, `--motion-easing-{key}` | `--motion-duration-fast: 150ms` |
| `opacity` | `--opacity-{key}` | `--opacity-disabled: 0.5` |
| `z-index` | `--z-{key}` | `--z-modal: 1000` |
| `breakpoints` | (used at build time, not CSS variables) | `sm: 640px` |

### Tier 2: Semantic Tokens

Purpose-driven aliases that reference primitive tokens. These are what components and application code should use.

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| Background | `--background` | `#ffffff` | `#09090b` |
| Foreground | `--foreground` | `#09090b` | `#fafafa` |
| Muted | `--muted` | `#f4f4f5` | `#18181b` |
| Muted foreground | `--mutedForeground` | `#71717a` | `#a1a1aa` |
| Border | `--border` | `#e4e4e7` | `#27272a` |
| Primary | `--primary` | `#09090b` | `#ffffff` |
| Card | `--card` | `#ffffff` | `#09090b` |
| Ring | `--ring` | `#09090b` | `#ffffff` |
| Input | `--input` | `#e4e4e7` | `#27272a` |

**Intent tokens** (nested under `semantic.intent`):

| Intent | `.bg` | `.fg` | `.border` |
|---|---|---|---|
| Success | `--intent-success-bg` | `--intent-success-fg` | `--intent-success-border` |
| Error | `--intent-error-bg` | `--intent-error-fg` | `--intent-error-border` |
| Warning | `--intent-warning-bg` | `--intent-warning-fg` | `--intent-warning-border` |
| Info | `--intent-info-bg` | `--intent-info-fg` | `--intent-info-border` |

### Tier 3: Component Tokens

Tokens scoped to specific components with interactive states. Available for: `button`, `input`, `card`, `badge`, `select`, `switch`.

Example — Button primary variant:

| State | Light | Dark |
|---|---|---|
| default | `#09090b` | `#fafafa` |
| hover | `#27272a` | `#e4e4e7` |
| active | `#3f3f46` | `#d4d4d8` |
| disabled | `#d4d4d8` | `#3f3f46` |
| foreground | `#ffffff` | `#09090b` |

CSS variables are generated as `--button-primary-default`, `--button-primary-hover`, etc.

---

## Light/Dark Switching

The CSS variable generator produces `[data-theme="light"]` and `[data-theme="dark"]` layers. Switch themes by setting the `data-theme` attribute:

```tsx
<html data-theme="dark">
```

The `ThemeProvider` component in `core` handles this automatically.

---

## Override API

Pass custom token overrides to `generateCSSVariables()`:

```ts
import { generateCSSVariables } from '@ui-construction-library/tokens';

const css = generateCSSVariables({
  mode: 'light',
  colors: {
    primary: { 500: '#6366f1' }, // override primary scale
  },
  semantic: {
    background: '#fafaf9',
  },
  components: {
    button: {
      primary: { default: '#6366f1' },
    },
  },
  overrides: {
    'custom-brand': '#ff6b35',
  },
});
```

---

## Usage in Components

Components should reference tokens through CSS variables, never hard-coded values:

```css
/* Good — uses semantic token */
.my-button {
  background: var(--button-primary-default);
  color: var(--button-primary-fg);
  border-radius: var(--radius-md);
}

/* Bad — hard-coded */
.my-button {
  background: #09090b;
  color: white;
}
```

---

## TypeScript Access

All token values are also available as typed JavaScript constants:

```ts
import {
  colors,
  spacing,
  typography,
  semanticLightColors,
  semanticDarkColors,
  componentLightTokens,
  componentDarkTokens,
} from '@ui-construction-library/tokens';

// Primitive
const primaryScale = colors.primary; // { 50: '...', 100: '...', ... }

// Semantic
const bg = semanticLightColors.background; // '#ffffff'

// Component
const buttonBg = componentLightTokens.button.primary.default; // '#09090b'
```
