# @ui-construction-library/tokens

Design token and theme contract for the UI Construction Library. Contains color scales, typography, spacing, semantic tokens, CSS variables, and a Tailwind preset.

## When to use

Use this package when you need to:
- Customise the theme or brand colours
- Reference token values in custom CSS
- Integrate with a design tool or token pipeline
- Use the Tailwind preset

`@ui-construction-library/core` already depends on this package internally. You only need to install it separately for explicit token access or Tailwind integration.

## Installation

```bash
pnpm add @ui-construction-library/tokens
```

No peer dependencies required — this package works without React.

## Minimal example

```ts
import { generateCSSVariables, colors, motion } from '@ui-construction-library/tokens';

// Generate CSS variable declarations for a given mode
const css = generateCSSVariables({ mode: 'dark' });
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// Access raw token values
console.log(colors.blue[500]); // '#3b82f6'
```

## Tailwind integration

```ts
// tailwind.config.ts
import preset from '@ui-construction-library/tokens/tailwind.preset';

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
};
```

## CSS variables

Import the token stylesheet directly:

```ts
import '@ui-construction-library/tokens/css';
```

This injects all semantic CSS variables (`--color-primary`, `--radius`, `--shadow-md`, etc.) into `:root`.

## Integration with core

`core` automatically uses the token contract. To override theme values, pass a custom theme object to `ThemeProvider`:

```tsx
import { ThemeProvider } from '@ui-construction-library/core';

<ThemeProvider theme="light" tokenOverrides={{ '--color-primary': '#7c3aed' }}>
  {/* app */}
</ThemeProvider>
```

## Compatibility

- Framework-agnostic — works in React, Vue, plain HTML, or Node.js scripts
- TypeScript 5.x and 6.x

## Public API

```ts
import { generateCSSVariables, colors, motion } from '@ui-construction-library/tokens';
```

Subpath exports:
- `@ui-construction-library/tokens` — JS token objects and utilities
- `@ui-construction-library/tokens/css` — CSS variable stylesheet
- `@ui-construction-library/tokens/tailwind.preset` — Tailwind preset

## Troubleshooting

**CSS variables not resolving** — make sure you import `@ui-construction-library/tokens/css` or `@ui-construction-library/core/styles.css` (which includes the token variables) before your own styles.

**Tailwind classes not working** — confirm the preset is listed in `presets` in your Tailwind config and that your content paths include your source files.
