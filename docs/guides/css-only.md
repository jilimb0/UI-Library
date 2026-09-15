# CSS-only usage (no React)

This guide is for consumers that render plain HTML — server-side templates,
static sites, or non-React apps — and want the design system without the
React runtime.

## What to load

```html
<link rel="stylesheet" href="…/@ui-construction-library/styles/dist/styles.css">
```

That single file carries resets, tokens, components, utilities and motion.
`@ui-construction-library/core/dist/styles.css` is the same stylesheet
rebuilt for the React entrypoint; pick one, never both.

Enable dark mode by setting the attribute (no JavaScript framework needed):

```html
<html data-theme="dark">
```

Without the attribute the light theme applies. `ThemeProvider` is a React
convenience wrapper around exactly these two steps.

## Class contract

All styling is class-based and framework-agnostic. The stable contract:

- Layout: `.ucl-stack` (column), `.ucl-cluster` (wrapping row),
  `.ucl-cluster--between` (space-between row), `.ucl-surface`
- Type: `.ucl-text-xs` … `.ucl-text-2xl`, `.ucl-text-muted`,
  `.ucl-text-primary|success|warning|error|info`, `.ucl-truncate`
- Components: `.button .button--{default,destructive,outline,secondary,ghost,link,success,warning,info}`,
  `.badge .badge--{default,success,warning,error,info}`,
  `.alert .alert--{default,success,warning,error,info}`,
  `.table` (+ `.table--striped`, `.table--compact`, `.table-sticky-header`),
  `.input`, `.select`, `.tag`, `.card`, `.kpi-card`, `.tabs-list`,
  `.tabs-trigger`, `.pagination-btn`
- Interactive state that CSS cannot own is exposed via `data-state`
  (`active` | `checked` | `open`, e.g. `.tabs-trigger[data-state='active']`).
  **Outside React, your code must set these attributes** — the stylesheet only
  styles them. See `docs/guides/framework-agnostic/` for per-framework
  adapters.
- A contract test (`packages/styles/src/index.test.ts`) asserts every class
  listed here exists in the built CSS. If a class from this guide is missing
  from a release, that is a bug — file it.

## Interactive state without React (data-state ownership)

| Component | Attribute | Who sets it (vanilla) |
|---|---|---|
| Tabs trigger | `data-state="active"` | your tab-switch handler |
| Switch/checkbox | `data-state="checked"` | your change handler |
| Dropdown/menu/popover | `data-state="open"` | your open/close handler |

## Tables

```html
<table class="table table--striped table--compact">
  <thead><tr><th>Symbol</th></tr></thead>
  <tbody><!-- rows --></tbody>
</table>
```

Sticky headers: add `table-sticky-header` (works inside any scroll container;
the header needs an opaque background — provided by the `th` rule). Sorting
has no pure-CSS affordance: keep `aria-sort` on the `th` and render your own
arrow glyph; behavior stays in your code.

## Fonts

The type tokens reference `Inter` (sans) and `JetBrains Mono` (mono), but the
packages ship **no webfonts** (`@font-face` is intentionally absent to keep
the CSS dependency-free). Until a self-hosted fonts package lands, load them
yourself, e.g.:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
>
```

Without this the stack falls back to system fonts — layout still holds
because all sizing uses relative units.

## Browser baseline

Some translucent component tints use `color-mix()` (badges, table hover).
Supported baseline: **Chrome 111+, Edge 111+, Firefox 113+, Safari 16.2+**
(2023). Older browsers render those tints as transparent backgrounds with
fully readable text — degraded but functional. No `@supports` fallback is
shipped; if you must support older browsers, override the affected rules.

## Utility notes

- New layout utilities (`.ucl-cluster--between`, `.ucl-sticky-top`,
  `.ucl-w-full`, `.ucl-text-info`) carry no `!important`.
- Legacy exception: core's old `.flex-center` keeps `!important` on all props
  for backward compatibility — prefer the `ucl-` utilities in new code.
