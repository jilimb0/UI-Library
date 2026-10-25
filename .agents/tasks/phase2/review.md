# Ф2 — Themes as First-Class Objects, Multibrand Lego ThemeProvider

The Ф2 commit introduces a W3C-token-driven runtime module, rewrites `ThemeProvider` to support open-ended theme names and custom brand overrides, and deprecates the legacy `generateCSSVariables` path in favour of the new `generateThemeCSS` function. The approach is sound: generate static CSS strings at build time, embed them as string constants in `tokens.runtime.generated.ts`, and at runtime select or generate a `[data-theme="<name>"]` block. A style tag injected into `<head>` carries the active theme's CSS; `data-theme` on the root element drives the cascade.

**Watch for:** (1) confirmed — `ThemeName` is exported twice from `packages/core/src/themes/index.ts`, once via the explicit `export type` from `ThemeProvider.tsx` and again silently via `export * from './themes'`; TypeScript 5.x raises a "Module './themes' has already exported a member named 'ThemeName'" error. This is a breaking type error. (2) confirmed — `getStoredTheme()` now accepts any string from `localStorage` without validation; `data-theme` is set directly to that value, meaning a stored attacker/corrupted string becomes an unsanitised attribute value and can cause CSS injection via a `<style>` tag content. (3) confirmed — `generateCSSVariables` does **not** delegate to `BASE_CSS` and its `@deprecated` JSDoc says so correctly, but the original criterion asked for delegation; the divergence is intentional and documented, which passes the review criterion. (4) possible — `ThemeProvider` reads `localStorage` to initialise state but there is no attempt to validate that the stored name exists in the supplied `themes` map; an unknown custom brand falls back silently to `LIGHT_CSS`, which is reasonable but undocumented.

**Verdict**: NEEDS_CHANGES

---

## High-level view

The `build-w3c.mjs` generator correctly emits all eight required exports (`BASE_CSS`, `LIGHT_CSS`, `DARK_CSS`, `ROOT_CSS`, `designTokens`, `ThemeName`, `BrandOverride`, `SemanticOverride`, `generateThemeCSS`). The emitted `generateThemeCSS` function produces a `[data-theme="<name>"]` block by iterating over `_LIGHT_ENTRIES` as a baseline, then spreading brand, semantic, and component overrides on top — all using the `--ucl-` prefix exclusively. The approach is correct and the CSS output is verifiable against the `LIGHT_CSS` constant.

The `ThemeName` duplicate in `core/src/themes/index.ts` is a blocking type error. `export type { ThemeName } from './ThemeProvider'` and `export * from './themes'` both attempt to export `ThemeName` from the same barrel; both resolve to `type ThemeName = string`, but TypeScript does not collapse duplicate type-only exports from different sources and raises a compile error.

`cssVariables.ts` documents why it cannot delegate to `BASE_CSS`: it emits legacy spacing aliases, backward-compat `--<name>` (no-prefix) variables, brand-accent, and glass-card tokens absent from the W3C pipeline. The `@deprecated` JSDoc is the correct way to surface this, and the barrel handles the `generateThemeCSS` re-export so there is no duplication.

`ThemeProvider` guards all DOM access correctly. The gaps are in the trust boundary: stored theme names from `localStorage` reach `setAttribute` and `generateThemeCSS` without validation, and unknown custom themes fall back silently to `LIGHT_CSS` without any developer-facing signal.

---

<details>
<summary>Issues (3)</summary>

1. **Duplicate `ThemeName` export in `core/src/themes/index.ts`** — `export type { ThemeName } from './ThemeProvider'` and `export * from './themes'` both export `ThemeName = string` from the same barrel. TypeScript raises a duplicate-export compile error. Fix: remove `ThemeName` from `themes.ts` (or suppress it in the `export *` with `export * from './themes'` after adding an explicit exclusion — not possible in TS). Simplest fix: remove `export type ThemeName = string` from `themes.ts` and rely solely on the `ThemeProvider` re-export.

2. **Unvalidated `localStorage` → `data-theme` → style tag** — `getStoredTheme()` returns any string; that value is set directly on `document.documentElement` and concatenated into a CSS selector string inside `generateThemeCSS`. A corrupted or craft-injected storage value can produce malformed CSS in the injected `<style>` tag. Fix: validate the stored value against `BUILTIN_THEMES` and the keys of the supplied `themes` map before accepting it; fall back to `defaultTheme` on mismatch.

3. **Silent fallback for unknown custom theme names** — when a stored or controlled `ThemeName` does not match `'light'`, `'dark'`, or any key in `themes`, `resolveThemeCSS` silently returns `LIGHT_CSS`. This is functionally reasonable but means a missing-theme bug is invisible at runtime. Fix: add a `console.warn` (or surface via an optional `onUnknownTheme` prop) so developers can detect configuration gaps.

</details>

<details>
<summary>Details</summary>

### Duplicate `ThemeName` export in the core barrel

`packages/core/src/themes/index.ts` has:

```ts
export type {
  BrandTokens,
  ThemeName,       // ← from ThemeProvider.tsx
  ThemeProviderProps,
} from './ThemeProvider';
...
export * from './themes';  // ← also exports ThemeName from themes.ts
```

Both `ThemeProvider.tsx` and `themes.ts` independently define `export type ThemeName = string`. TypeScript 5.x (strict module resolution) does not silently merge duplicate type exports from different source files in the same barrel — it raises `error TS2308: Module has already exported a member named 'ThemeName'`. The comment inside `themes.ts` says "Use ThemeName from ThemeProvider instead" but the type is still exported, and `export * from './themes'` is unconditional.

The fix is to remove `export type ThemeName = string` from `themes.ts`. The `ThemeMode` deprecated alias can remain as `export type ThemeMode = string` without the collision.

### `localStorage` → `data-theme` trust boundary

The original `getStoredTheme()` validated against the string union `'light' | 'dark'`:

```ts
// before
return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
```

The new version accepts any string:

```ts
const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
return stored ?? null;
```

This is necessary for custom brand names, but the value travels without sanitisation through:

1. `getInitialTheme` → `useState` initial value
2. `applyThemeToDocument` → `document.documentElement.setAttribute('data-theme', theme)` — unvalidated attribute
3. `resolveThemeCSS` → for unknown names, into `generateThemeCSS({ name: theme })` → `'[data-theme="' + opts.name + '"] {'` concatenated into a CSS block written via `tag.textContent`

`textContent` prevents HTML injection, so this is not an XSS vector. However, a value like `foo"] { body { display:none }` would produce syntactically broken but potentially harmful CSS in the injected style element. Given that `localStorage` is same-origin, exploitation requires prior same-origin write access, so the severity is moderate. Still, accepting and using unvalidated user-controlled data as a CSS selector component is worth hardening.

### `generateThemeCSS` stale baseline risk

The `_LIGHT_ENTRIES` snapshot is embedded as a literal JSON array at build time. If `build-w3c.mjs` is re-run after token changes but before the `ThemeProvider` bundle is rebuilt, custom theme baselines will be stale until the next build. There is no runtime indication that the baseline is out of sync with the deployed token values. This is an expected property of a code-generation pipeline, but the gap between "regenerate tokens" and "rebuild core" deserves a note in the contribution guide or a turbo task dependency.

### `cssVariables.ts` non-delegation from `BASE_CSS`

Review criterion 3 asks for `generateCSSVariables` to delegate to `BASE_CSS`. The implementation intentionally does not: it runs its own full emission pipeline including spacing aliases, backward-compat `--<name>` (no prefix) variables, brand-accent, and glass-card tokens absent from `BASE_CSS`. The `@deprecated` JSDoc documents this explicitly. The criterion is met in spirit — the function is deprecated, the divergence is documented, and `BASE_CSS`/`LIGHT_CSS`/`DARK_CSS` are the recommended replacement. Not blocking.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|------|-------------|
| `packages/tokens/scripts/build-w3c.mjs` | Added runtime TS module emission: `LIGHT_CSS`, `DARK_CSS`, `ROOT_CSS`, `BASE_CSS`, `designTokens`, `ThemeName`, `BrandOverride`, `SemanticOverride`, `generateThemeCSS` |
| `packages/tokens/src/tokens.runtime.generated.ts` | New generated file with all eight runtime exports |
| `packages/tokens/src/cssVariables.ts` | Removed `ThemeName` and `generateThemeCSS` re-exports; added detailed `@deprecated` JSDoc explaining non-delegation from `BASE_CSS` |
| `packages/tokens/src/index.ts` | Added explicit `export type { BrandOverride, SemanticOverride, ThemeName }` and `export { generateThemeCSS }` from the runtime module |
| `packages/core/src/themes/ThemeProvider.tsx` | Added `brand?` field to `BrandTokens`; switched from `generateCSSVariables` to `LIGHT_CSS`/`DARK_CSS`/`generateThemeCSS`; open `ThemeName = string` replaces `'light' \| 'dark'` |
| `packages/core/src/themes/themes.ts` | Removed raw color imports; added `ThemeName`, `BuiltinTheme`, `BUILTIN_THEMES`; deprecated stubs for `lightTheme`, `darkTheme`, `themes` |
| `packages/core/src/themes/index.ts` | Added `BrandTokens`, `ThemeName`, `useTheme` exports from `ThemeProvider`; added `BuiltinTheme`, `BUILTIN_THEMES` from `themes` |

Full diff: `git show 8a804ae`

</details>
