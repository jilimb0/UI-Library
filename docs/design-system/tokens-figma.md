# Design Tokens — Figma & Tooling Integration

## W3C Design Tokens Format

The canonical token source is `packages/tokens/src/tokens.w3c.json`  
in [W3C Design Tokens Format](https://design-tokens.org/).

This file is **the single source of truth** — all CSS, TypeScript, and  
Tailwind artifacts are generated from it.

---

## Figma — Tokens Studio

1. Install the **Tokens Studio** plugin in Figma  
   (formerly Figma Tokens, by Jan Six).

2. In the plugin sidebar → **Sync** → **Local file / URL**.

3. Point it to:
   - `packages/tokens/src/tokens.w3c.json` (W3C source, with aliases)
   - or `packages/tokens/dist/w3c/tokens.resolved.json` (fully resolved values, no aliases)

4. Token groups in the file:
   | Path | Contents |
   |------|----------|
   | `color.primitive` | Raw color palettes (neutral/success/warning/error/info) |
   | `color.semantic.light` | Light theme semantic tokens (background, primary, muted…) |
   | `color.semantic.dark` | Dark theme semantic tokens |
   | `color.component.light` | Component-state tokens (button-primary-hover, input-border-focus…) |
   | `radius`, `spacing` | Dimensions |
   | `typography` | Font family, size, weight, leading, tracking |
   | `shadow`, `motion` | Elevation, duration, easing |

5. After editing in Figma, export and overwrite `tokens.w3c.json`,  
   then regenerate: `pnpm --filter @ui-construction-library/tokens build:w3c`

---

## Style Dictionary (optional)

Style Dictionary can transform `tokens.w3c.json` into additional formats  
(Swift, Kotlin, JSON, CSS, SCSS…).

```bash
# Install (one-time, not a project dep)
npm install -g style-dictionary

# Build
cd packages/tokens
npx style-dictionary build --config style-dictionary.config.mjs
```

Output lands in `packages/tokens/dist/sd/`:
- `variables.css` — flat CSS custom properties with `--ucl-` prefix  
- `tokens.js` — ESM JS object

Config file: `packages/tokens/style-dictionary.config.mjs`

---

## Consuming generated CSS artifacts

```css
/* Option A — W3C-generated CSS (recommended) */
@import "@ui-construction-library/tokens/w3c/css";

/* Option B — Tailwind v4 @theme bridge */
@import "tailwindcss";
@import "@ui-construction-library/tokens/w3c/tailwind";
/* Enables: bg-primary, text-muted-foreground, border-border, etc. */
```

---

## Consuming in TypeScript

```ts
import designTokens from "@ui-construction-library/tokens/w3c";

const primary = designTokens.color.semantic.light["color-primary"].$value;
// "#1d1d1f"
```

Or the fully resolved JSON:

```ts
import resolved from "@ui-construction-library/tokens/w3c/resolved";
```
