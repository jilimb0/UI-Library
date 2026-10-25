# Implementation Plan — Ф2: Themes as First-Class Objects

**Branch:** feature/phase2-themes-first-class  
**Commit target:** `feat(themes,tokens): Ф2 — themes as first-class objects,
multibrand lego ThemeProvider`

---

## Codebase findings that inform every step

- `build-w3c.mjs` already builds `block()` helpers, `lightEntries` /
  `darkEntries` / `rootEntries` arrays, and a full `css` string and `ts`
  string.  The runtime generator lives entirely in that script — no separate
  module exists yet.  The script must be extended in-place; importing it from
  another module is not viable (it is `.mjs`, not TypeScript).

- `tokens.w3c.json` uses `color.semantic.light.*` and
  `color.semantic.dark.*` plus `color.component.light.*` /
  `color.component.dark.*`.  The `scopeOf()` helper in the script already
  tags entries as `'light'` | `'dark'` | `'root'`.  The `deriveName()`
  helper already strips the theme-scope segment and emits `color-*`,
  `intent-*`, `button-*` etc. names — so `lightEntries` and `darkEntries`
  already carry all semantic + component lines.

- `biome.json` excludes `**/*.generated.ts` from linting/formatting, so
  `tokens.runtime.generated.ts` is exempt from Biome formatting rules.
  Line width and quote style still apply to all hand-authored `.ts` / `.tsx`
  files.

- `cssVariables.ts` exports `generateCSSVariables(theme?: Theme): string`
  and the `Theme` interface.  Existing tests in `cssVariables.test.ts` rely
  on `generateCSSVariables()` (no-arg call) and check for legacy
  `--color-*` aliases.  The rewrite must keep both passing without change.

- `useTheme.ts` re-exports `ThemeContextValue` and `ThemeProviderProps` from
  `ThemeProvider.tsx`, so changing those types in `ThemeProvider.tsx` flows
  automatically.

- `themes/index.ts` currently exports `useTheme`, `THEME_STORAGE_KEY`, and
  `useThemeHook` (alias) from `./useTheme`.  The step-5 rewrite must
  preserve `THEME_STORAGE_KEY` (exported from `useTheme.ts`) or
  re-export it explicitly.

- TypeScript `type` re-exports need the `type` keyword to satisfy
  `isolatedModules` (the tokens tsconfig does not set it explicitly, but
  the root tsconfig likely does — use `export type` for all pure-type
  re-exports to be safe).

- `tokens/src/index.ts` must not gain a wildcard re-export of the generated
  file because that would pull its runtime-specific functions into every
  consumer.  A named re-export of `generateThemeCSS` only is correct.

---

## Step 1 — Extend `build-w3c.mjs` to also emit `tokens.runtime.generated.ts`

### What to do

After the existing block that writes `dist/w3c/tokens.ts`, add a second
write target: `packages/tokens/src/tokens.runtime.generated.ts`.

The generated file must export:

| Export | Content |
|--------|---------|
| `BASE_CSS` | The existing `css` string (entire CSS already assembled) |
| `LIGHT_CSS` | A single block: `:root:not([data-theme]), [data-theme="light"] { … }` built from `lightEntries` |
| `DARK_CSS` | A single block: `[data-theme="dark"] { … }` built from `darkEntries` |
| `ROOT_CSS` | A single block: `:root { … }` built from `rootEntries` |
| `designTokens` | The `resolved` object — same as in `dist/w3c/tokens.ts`, serialised as `as const` |
| `type ThemeName` | `string` |
| `type BrandOverride` | `Record<string, Record<string, string>>` |
| `type SemanticOverride` | `Record<string, string>` |
| `function generateThemeCSS(opts)` | See specification below |

**`generateThemeCSS` implementation logic** (emitted verbatim as a JS/TS
function body inside the generated string):

```
function generateThemeCSS(opts) {
  // 1. Collect the resolved light semantic entries as a baseline.
  //    These are already in lightEntries (module-level), which the generator
  //    has access to at write-time — but the *runtime* call to generateThemeCSS
  //    happens in the consumer's browser, not at build time.
  //
  //    Therefore the function body must carry its own baseline:
  //    embed the lightEntries array as a literal inside the generated file,
  //    keyed as { name, value } pairs.
  //
  // 2. Spread SemanticOverride on top of baseline semantic names.
  // 3. Spread component overrides similarly.
  // 4. Build a [data-theme="<name>"] { --ucl-* } block and return the string.
}
```

Concretely, the script must:

1. Build two in-memory JSON literals at script-run-time:
   - `BASELINE_SEMANTIC` — an array of `{ name, value }` from `lightEntries`
     (these are the semantic + component CSS var lines already computed).
   - Actually, `lightEntries` already contains **all** semantic/component
     tokens needed.  Serialise `lightEntries` as a `const` array inside the
     generated file.

2. The emitted `generateThemeCSS` function references that embedded literal,
   merges overrides, and emits the block.  It does **not** import anything —
   the generated file is self-contained.

**Full signature to emit:**

```ts
export function generateThemeCSS(opts: {
  name: string;
  brand?: BrandOverride;
  semantic?: SemanticOverride;
  component?: Record<string, Record<string, string>>;
}): string
```

**Block construction rules:**

- Selector: `[data-theme="${opts.name}"] {`
- Start from the embedded `lightEntries` baseline (semantic + component
  lines).
- For each entry in `opts.semantic`: override any existing line whose
  `--ucl-<name>` matches `color-<key>` (or add new), and emit
  `  --ucl-<key>: <value>;`.
- For each top-level key in `opts.brand`: emit
  `  --ucl-color-<brandScale>-<tone>: <value>;` for each tone.
- For each entry in `opts.component`: emit
  `  --ucl-<componentName>-<tokenName>: <value>;`.
- No legacy `--` (bare) aliases emitted for custom theme blocks — only
  `--ucl-` prefix.
- Close block with `}`.

**File header to emit:**

```ts
/* AUTO-GENERATED from tokens.w3c.json — do not edit.           */
/* Re-generate: node packages/tokens/scripts/build-w3c.mjs       */
```

**Also add to `.gitignore`** (append after the existing last line):

```
# Generated runtime token module (re-generated by build-w3c.mjs)
packages/tokens/src/tokens.runtime.generated.ts
```

### Files to modify / create

- `packages/tokens/scripts/build-w3c.mjs` — extend with runtime-file
  emission (the only hand-authored change in this step)
- `.gitignore` — append the generated-file entry
- `packages/tokens/src/tokens.runtime.generated.ts` — produced by running
  the script (do **not** hand-author it)

### Order of operations

1. Edit `build-w3c.mjs`.
2. Edit `.gitignore`.
3. Run `node packages/tokens/scripts/build-w3c.mjs` to produce the
   generated file.

### Verify

```bash
node packages/tokens/scripts/build-w3c.mjs
# Expected: "✓ W3C tokens → dist/w3c/ (N root, N light, N dark)"
# and a second line: "✓ runtime module → src/tokens.runtime.generated.ts"

# Confirm all required exports exist in the generated file:
grep -E 'export (const|function|type)' \
  packages/tokens/src/tokens.runtime.generated.ts
# Must list: BASE_CSS, LIGHT_CSS, DARK_CSS, ROOT_CSS,
#            designTokens, ThemeName, BrandOverride,
#            SemanticOverride, generateThemeCSS
```

---

## Step 2 — Rewrite `packages/tokens/src/cssVariables.ts`

### What to do

Replace the body of `cssVariables.ts` so that `generateCSSVariables()`
delegates to `BASE_CSS` from the runtime module, while preserving the
existing public surface exactly:

- Keep `export type ThemeName = 'light' | 'dark'` (existing consumers
  import it).
- Keep `export interface Theme { … }` unchanged.
- Replace the function body: return `BASE_CSS` from the runtime module
  (the full CSS already includes both theme layers and `:root`, which is
  identical to what the old function produced).
- Add `@deprecated` JSDoc on `generateCSSVariables` pointing to
  `generateThemeCSS`.

**Key constraint:** the existing tests in `cssVariables.test.ts` test
specific CSS content (`:root:not([data-theme]), [data-theme="light"]`,
`--ucl-radius-lg: 12px`, `--ucl-brand-accent: #6C7BFF`, etc.).  The
`BASE_CSS` from the W3C pipeline does **not** emit the non-color tokens
(spacing, radius, shadows, typography, motion, brand-accent, glass-card)
that those tests expect — those are only in the old `generateCSSVariables()`
path.

**Resolution:** keep the real implementation in `cssVariables.ts` producing
the full CSS, and add the delegation path only as a fallback / future.
Actually the task description says "make it delegate to BASE_CSS from the
runtime module" — but the W3C pipeline's `BASE_CSS` does not include spacing,
typography, etc.  Delegating wholesale would break the existing tests.

**Correct approach for this step:**

- Keep the full token emission logic intact inside `cssVariables.ts` (it
  already works and the tests pass).
- Import `generateThemeCSS` from the runtime module for re-export in
  `index.ts` (Step 6), but do **not** break `generateCSSVariables`.
- Mark `generateCSSVariables` as `@deprecated` pointing to `generateThemeCSS`
  for new custom-theme use-cases.
- Export `generateThemeCSS` from `cssVariables.ts` as a re-export from the
  runtime module, so `index.ts` can pick it up cleanly.

This interpretation satisfies the task goal (exposing `generateThemeCSS`)
without breaking existing consumers or tests.  The "delegate to BASE_CSS"
wording applies to the spirit (single source of truth for CSS generation)
and will be fully realised in a subsequent phase when the W3C pipeline
produces all token categories.

**Concrete changes:**

```ts
// At top: add import
import { generateThemeCSS } from './tokens.runtime.generated';

// After existing Theme interface:
export { generateThemeCSS };

// On generateCSSVariables:
/**
 * @deprecated Use generateThemeCSS from @ui-construction-library/tokens
 *   for custom themes. generateCSSVariables will be removed in a future
 *   major release once the W3C pipeline emits all token categories.
 */
export function generateCSSVariables(theme: Theme = {}): string { … }
```

### Files to modify

- `packages/tokens/src/cssVariables.ts`

### Verify

```bash
pnpm --filter @ui-construction-library/tokens test
# All existing cssVariables tests must still pass.
pnpm --filter @ui-construction-library/tokens typecheck
# 0 errors.
```

---

## Step 3 — Rewrite `packages/core/src/themes/ThemeProvider.tsx`

### What to do

Replace the entire file.  The new implementation must satisfy:

**Types** (all defined locally in this file):

```ts
export type ThemeName = string;

export interface BrandTokens {
  semantic?: Record<string, string>;
  component?: Record<string, Record<string, string>>;
}

export interface ThemeProviderProps {
  defaultTheme?: ThemeName;
  theme?: ThemeName;         // controlled mode
  themes?: Record<string, BrandTokens>; // custom brand registrations
  children: ReactNode;
}

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}
```

**Behaviour:**

1. **Storage key:** Use `'ucl-theme'` (new, as specified).  Note: existing
   `THEME_STORAGE_KEY` constant in `useTheme.ts` is `'ui-library-theme'`.
   The ThemeProvider must use `'ucl-theme'` internally; `useTheme.ts` keeps
   its own constant for backward compat.

2. **Uncontrolled mode** (`theme` prop absent): read initial value from
   `localStorage.getItem('ucl-theme')` → fall back to `defaultTheme ?? 'light'`.
   On theme change, write to `localStorage.setItem('ucl-theme', value)`.

3. **Controlled mode** (`theme` prop present): `resolvedTheme = theme` prop.
   Do **not** write to localStorage.

4. **CSS injection** via `<style id="ucl-theme">` on `document.head`:
   - `'light'`: inject `LIGHT_CSS` from runtime module.
   - `'dark'`: inject `DARK_CSS` from runtime module.
   - Any other name: look up `themes?.[name]`, call
     `generateThemeCSS({ name, ...brandTokens })`, inject the result.
   - Guard: if `typeof document === 'undefined'` (SSR), skip all DOM
     operations.

5. **`data-theme` attribute:** set on `document.documentElement`.

6. **`useTheme` hook:** export from this file (the existing `useTheme.ts`
   re-exports it from here, so this is the canonical location).

**Implementation notes:**

- Import `LIGHT_CSS`, `DARK_CSS`, `generateThemeCSS` from
  `@ui-construction-library/tokens`.
- The `useEffect` for theme application runs on `[resolvedTheme, themes]`.
- `ensureStyleTag()` helper: get-or-create the `<style id="ucl-theme">`
  element.
- The `ThemeContext` default value is `undefined`; `useTheme` throws if
  context is missing.
- Keep the `ThemeProvider` as the default export.

### Files to modify

- `packages/core/src/themes/ThemeProvider.tsx` — full rewrite

### Verify

```bash
pnpm --filter @ui-construction-library/core typecheck
# 0 errors.
```

---

## Step 4 — Rewrite `packages/core/src/themes/themes.ts`

### What to do

Replace the file contents.  Remove all imports from
`@ui-construction-library/tokens` (colors, semanticLightColors,
semanticDarkColors).

New exports:

```ts
export type ThemeName = string;
export type BuiltinTheme = 'light' | 'dark';
export const BUILTIN_THEMES = ['light', 'dark'] as const;

/**
 * @deprecated Use ThemeName (open string type) from ThemeProvider.
 * Will be removed in the next major version.
 */
export type ThemeMode = BuiltinTheme;

/**
 * @deprecated lightTheme object is no longer the source of truth for CSS.
 * Use LIGHT_CSS / generateThemeCSS from @ui-construction-library/tokens.
 */
export const lightTheme = { mode: 'light' } as const;

/**
 * @deprecated darkTheme object is no longer the source of truth for CSS.
 * Use DARK_CSS / generateThemeCSS from @ui-construction-library/tokens.
 */
export const darkTheme = { mode: 'dark' } as const;

/** @deprecated Use BUILTIN_THEMES or ThemeProviderProps.themes. */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;
```

**Decision:** `ThemeDefinition`, `LibraryThemeColors`, `LibraryThemeSemantic`
are **dropped** — they depended on token objects that are no longer exposed
at this level.  If any consumer imports them (checked via grep before
committing), add `@deprecated` type aliases pointing to `BrandTokens` from
`ThemeProvider`.  (A grep across `src/` shows they are only referenced
inside `themes.ts` itself and re-exported via `useTheme.ts`; `useTheme.ts`
must be updated accordingly in Step 5.)

### Files to modify

- `packages/core/src/themes/themes.ts` — full rewrite

### Verify

```bash
pnpm --filter @ui-construction-library/core typecheck
# 0 errors (may surface useTheme.ts re-export issues — fix in Step 5).
```

---

## Step 5 — Update `packages/core/src/themes/index.ts` and `useTheme.ts`

### What to do

**`useTheme.ts`** — update re-exports to match the new shapes:

- Remove `export type { ThemeDefinition }` (type is gone from `themes.ts`).
- Update `export type { ThemeContextValue, ThemeProviderProps }` — these
  remain valid from `ThemeProvider.tsx`.
- Keep `export const THEME_STORAGE_KEY = 'ui-library-theme'` (unchanged).
- Keep `export function useTheme()` body unchanged.

**`index.ts`** — replace with the specified re-export surface:

```ts
export type { ThemeProviderProps, BrandTokens } from './ThemeProvider';
export { default as ThemeProvider, useTheme } from './ThemeProvider';
export type { ThemeName, BuiltinTheme } from './themes';
export { BUILTIN_THEMES } from './themes';
// Preserve existing consumers of THEME_STORAGE_KEY and useThemeHook
export {
  THEME_STORAGE_KEY,
  useTheme as useThemeHook,
} from './useTheme';
```

**Note:** `useTheme` is now exported directly from `ThemeProvider` (the
canonical location after Step 3).  The `useTheme.ts` wrapper continues to
exist for backward compatibility but is not the primary export path.

### Files to modify

- `packages/core/src/themes/index.ts` — rewrite
- `packages/core/src/themes/useTheme.ts` — remove dropped type re-exports

### Verify

```bash
pnpm --filter @ui-construction-library/core typecheck
# 0 errors.
```

---

## Step 6 — Add `generateThemeCSS` to `packages/tokens/src/index.ts`

### What to do

Add a named re-export so consumers can do:

```ts
import { generateThemeCSS } from '@ui-construction-library/tokens';
```

Append to `packages/tokens/src/index.ts`:

```ts
export { generateThemeCSS } from './cssVariables';
```

This works because Step 2 already re-exports `generateThemeCSS` from
`cssVariables.ts`.  Do **not** add a wildcard `export * from './tokens.runtime.generated'`
— that would expose `BASE_CSS`, `LIGHT_CSS`, etc. as top-level tokens
exports, which is unnecessary and inflates bundle size for token-only
consumers.

### Files to modify

- `packages/tokens/src/index.ts`

### Verify

```bash
pnpm --filter @ui-construction-library/tokens typecheck
# 0 errors.
pnpm --filter @ui-construction-library/core typecheck
# 0 errors (core imports generateThemeCSS from tokens via ThemeProvider).
```

---

## Step 7 — Fix lint errors and commit

### What to do

Run Biome lint across both packages and fix any issues before committing.
Common issues to anticipate:

- Unused imports in `cssVariables.ts` if any old import is no longer needed.
- `noUnusedVariables` warnings in `themes.ts` if stub exports reference
  nothing.
- Import order in `ThemeProvider.tsx` (Biome organiseImports is `on`).

Then stage and commit all changed/new files.  Do **not** include `.kiro/`
in the commit.

### Files in the commit

```
packages/tokens/scripts/build-w3c.mjs
packages/tokens/src/tokens.runtime.generated.ts   ← newly generated
packages/tokens/src/cssVariables.ts
packages/tokens/src/index.ts
packages/core/src/themes/ThemeProvider.tsx
packages/core/src/themes/themes.ts
packages/core/src/themes/index.ts
packages/core/src/themes/useTheme.ts
.gitignore
```

### Verify (full sequence before commit)

```bash
# 1. Regenerate the runtime module to ensure it is fresh
node packages/tokens/scripts/build-w3c.mjs
# Expected output includes token counts on both lines

# 2. Confirm the generated file has all required exports
grep -E 'export (const|function|type)' \
  packages/tokens/src/tokens.runtime.generated.ts

# 3. TypeCheck tokens
pnpm --filter @ui-construction-library/tokens typecheck
# 0 errors

# 4. TypeCheck core
pnpm --filter @ui-construction-library/core typecheck
# 0 errors

# 5. Lint (Biome)
pnpm lint
# 0 errors

# 6. Commit
git add \
  packages/tokens/scripts/build-w3c.mjs \
  packages/tokens/src/tokens.runtime.generated.ts \
  packages/tokens/src/cssVariables.ts \
  packages/tokens/src/index.ts \
  packages/core/src/themes/ThemeProvider.tsx \
  packages/core/src/themes/themes.ts \
  packages/core/src/themes/index.ts \
  packages/core/src/themes/useTheme.ts \
  .gitignore

git commit -m \
  "feat(themes,tokens): Ф2 — themes as first-class objects, multibrand lego ThemeProvider"

# 7. Verify commit
git log --oneline -1
# Must show the commit message above
```

---

## Dependency order summary

```
Step 1 (build-w3c.mjs + .gitignore + run script → generates file)
  ↓
Step 2 (cssVariables.ts re-exports generateThemeCSS from generated file)
  ↓
Step 3 (ThemeProvider.tsx imports from @ui-construction-library/tokens)
  ↓
Step 4 (themes.ts — no external deps, self-contained cleanup)
  ↓
Step 5 (index.ts + useTheme.ts — depends on Step 3 & 4 shapes)
  ↓
Step 6 (tokens/src/index.ts — depends on Step 2)
  ↓
Step 7 (lint + typecheck + commit — depends on all above)
```

Steps 4 and 6 are independent of each other and can be done in either
order between their respective dependencies.
