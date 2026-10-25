# Ф3 Implementation Plan — Component-state tokens consumed by components

> Prepared by planning agent. Grounded in actual files read.
> Branch: `main`. Breaking changes allowed.
> Last commit before Ф3: `7dcfde9`.

---

## Key Findings (from exploration)

### The CSS variable bridge problem
`packages/core/src/styles/globals.css` defines legacy unprefixed aliases (`--primary`, `--error`,
`--background`, etc.) pointing to `--color-*` intermediates. `components.css` consumes these legacy
vars. The W3C pipeline (`build-w3c.mjs`) emits `--ucl-*` vars injected by `ThemeProvider` at
runtime. There is currently **no bridge** between `--ucl-button-primary-hover` and the CSS rules in
`components.css`. Ф3 must wire them up.

**Strategy chosen:** Update `components.css` to use `--ucl-*` state tokens directly (no new bridge
layer). Add a fallback to the semantic `--ucl-color-*` var so components degrade gracefully when the
ThemeProvider is absent. This is a breaking change to the public CSS class API — acceptable per spec.

### deriveName() formula
From `build-w3c.mjs` (lines ~63-76):
```
color.component.light.<comp>.<path...> → parts.slice(3).join('-') → --ucl-<comp>-<path...>
```
Examples verified against `dist/w3c/tokens.css`:
- `color.component.light.button.primary.hover` → `--ucl-button-primary-hover`
- `color.component.light.input.bg.focus` → `--ucl-input-bg-focus`
- `color.component.light.switch.track.on` → `--ucl-switch-track-on`

### What currently exists in tokens.w3c.json (component.light/dark)
Already defined: `button` (primary/secondary/ghost/outline), `input`, `card`, `badge`, `select`,
`switch`.

**Missing for Ф3:** `checkbox`, `radio`, `slider`, `tabs`, `accordion`, `pagination`, `tooltip`,
`dropdown` (menu-item hover/active/selected/destructive).

### Opacity hacks to replace in components.css (lines confirmed)
- L60: `.ucl-button--default:hover { opacity: 0.9; }` — uses `var(--primary)` not `--ucl-button-primary-*`
- L69: `.ucl-button--destructive:hover { opacity: 0.9; }`
- L78: `.ucl-button--success:hover { opacity: 0.9; }`
- L87: `.ucl-button--warning:hover { opacity: 0.9; }`
- L96: `.ucl-button--info:hover { opacity: 0.9; }`
Plus: button default/secondary/ghost/outline rules use `var(--primary)` / `var(--muted)` /
`var(--accent)` instead of `--ucl-button-*` state tokens.

### ButtonSize mismatch (Audit finding #8 / TARGET-ARCHITECTURE §2.5)
- `packages/behaviors/src/button.ts`: `ButtonSize = 'default' | 'sm' | 'lg' | 'icon'`
- `packages/core/src/types/component-types.ts`: `ButtonSize = 'sm' | 'md' | 'lg'`
- CSS classes: `.ucl-button--sm`, `.ucl-button--lg`, `.ucl-button--icon` (no `--md`, no `--default`)
- `behaviors/src/behaviors.test.ts` uses `'lg'` and `'sm'` (compatible) and `'default'` variant
  (not size). The `'icon'` size exists in CSS; `'md'` does not.
- **Decision:** Align to `'sm' | 'md' | 'lg' | 'icon'` — drop `'default'` size (redundant with the
  default fallback), add `'md'` as alias for the unsized default. Requires adding `.ucl-button--md`
  CSS rule equal to the base button sizing. This is the Ф3 scope for behaviors.

---

## New Token Paths and Derived CSS Variable Names

All paths below are under `color.component.light.*` (light) and `color.component.dark.*` (dark).

### checkbox
| Token path (after `color.component.{light|dark}.`) | CSS var name | Light value | Dark value |
|---|---|---|---|
| `checkbox.bg.unchecked` | `--ucl-checkbox-bg-unchecked` | `#ffffff` | `#161618` |
| `checkbox.bg.checked` | `--ucl-checkbox-bg-checked` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `checkbox.bg.disabled` | `--ucl-checkbox-bg-disabled` | `{color.primitive.neutral.100}` | `#1d1d1f` |
| `checkbox.border.default` | `--ucl-checkbox-border-default` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |
| `checkbox.border.hover` | `--ucl-checkbox-border-hover` | `{color.primitive.neutral.400}` | `rgba(255,255,255,0.22)` |
| `checkbox.border.checked` | `--ucl-checkbox-border-checked` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `checkbox.border.disabled` | `--ucl-checkbox-border-disabled` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |
| `checkbox.fg` | `--ucl-checkbox-fg` | `#ffffff` | `{color.primitive.neutral.700}` |

### radio
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `radio.accent` | `--ucl-radio-accent` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `radio.border.default` | `--ucl-radio-border-default` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |
| `radio.border.hover` | `--ucl-radio-border-hover` | `{color.primitive.neutral.400}` | `rgba(255,255,255,0.22)` |
| `radio.border.disabled` | `--ucl-radio-border-disabled` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |

### slider
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `slider.track.bg` | `--ucl-slider-track-bg` | `{color.primitive.neutral.200}` | `{color.primitive.neutral.600}` |
| `slider.range.bg` | `--ucl-slider-range-bg` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `slider.thumb.bg` | `--ucl-slider-thumb-bg` | `#ffffff` | `#161618` |
| `slider.thumb.border` | `--ucl-slider-thumb-border` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `slider.thumb.hover` | `--ucl-slider-thumb-hover` | `{color.primitive.neutral.900}` | `#ffffff` |
| `slider.thumb.disabled` | `--ucl-slider-thumb-disabled` | `{color.primitive.neutral.300}` | `{color.primitive.neutral.600}` |

### tabs
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `tabs.list.bg` | `--ucl-tabs-list-bg` | `{color.primitive.neutral.100}` | `#1d1d1f` |
| `tabs.trigger.default` | `--ucl-tabs-trigger-default` | `transparent` | `transparent` |
| `tabs.trigger.hover` | `--ucl-tabs-trigger-hover` | `{color.primitive.neutral.200}` | `#2a2a2c` |
| `tabs.trigger.active` | `--ucl-tabs-trigger-active` | `#ffffff` | `#161618` |
| `tabs.trigger.fg.default` | `--ucl-tabs-trigger-fg-default` | `{color.primitive.neutral.500}` | `{color.primitive.neutral.400}` |
| `tabs.trigger.fg.active` | `--ucl-tabs-trigger-fg-active` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |

### accordion
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `accordion.trigger.default` | `--ucl-accordion-trigger-default` | `transparent` | `transparent` |
| `accordion.trigger.hover` | `--ucl-accordion-trigger-hover` | `{color.primitive.neutral.100}` | `#1d1d1f` |
| `accordion.trigger.fg` | `--ucl-accordion-trigger-fg` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `accordion.content.fg` | `--ucl-accordion-content-fg` | `{color.primitive.neutral.500}` | `{color.primitive.neutral.400}` |
| `accordion.border` | `--ucl-accordion-border` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |

### pagination
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `pagination.btn.bg` | `--ucl-pagination-btn-bg` | `#ffffff` | `#161618` |
| `pagination.btn.bg.hover` | `--ucl-pagination-btn-bg-hover` | `{color.primitive.neutral.100}` | `#1d1d1f` |
| `pagination.btn.bg.active` | `--ucl-pagination-btn-bg-active` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `pagination.btn.border` | `--ucl-pagination-btn-border` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |
| `pagination.btn.fg` | `--ucl-pagination-btn-fg` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `pagination.btn.fg.active` | `--ucl-pagination-btn-fg-active` | `#ffffff` | `{color.primitive.neutral.700}` |

### tooltip
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `tooltip.bg` | `--ucl-tooltip-bg` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `tooltip.fg` | `--ucl-tooltip-fg` | `#ffffff` | `{color.primitive.neutral.700}` |
| `tooltip.border` | `--ucl-tooltip-border` | `transparent` | `transparent` |

### dropdown (menu-item)
| Token path | CSS var name | Light value | Dark value |
|---|---|---|---|
| `dropdown.menu.bg` | `--ucl-dropdown-menu-bg` | `#ffffff` | `#161618` |
| `dropdown.item.bg.default` | `--ucl-dropdown-item-bg-default` | `transparent` | `transparent` |
| `dropdown.item.bg.hover` | `--ucl-dropdown-item-bg-hover` | `{color.primitive.neutral.100}` | `#1d1d1f` |
| `dropdown.item.bg.active` | `--ucl-dropdown-item-bg-active` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `dropdown.item.fg` | `--ucl-dropdown-item-fg` | `{color.primitive.neutral.700}` | `{color.primitive.neutral.100}` |
| `dropdown.item.fg.active` | `--ucl-dropdown-item-fg-active` | `#ffffff` | `{color.primitive.neutral.700}` |
| `dropdown.item.fg.destructive` | `--ucl-dropdown-item-fg-destructive` | `{color.primitive.error.500}` | `#e05858` |
| `dropdown.item.bg.destructive.hover` | `--ucl-dropdown-item-bg-destructive-hover` | `{color.primitive.error.50}` | `#2a0c0c` |
| `dropdown.trigger.border` | `--ucl-dropdown-trigger-border` | `{color.primitive.neutral.300}` | `rgba(255,255,255,0.10)` |
| `dropdown.trigger.bg` | `--ucl-dropdown-trigger-bg` | `#ffffff` | `#161618` |
| `dropdown.trigger.bg.hover` | `--ucl-dropdown-trigger-bg-hover` | `{color.primitive.neutral.100}` | `#1d1d1f` |

---

## Implementation Plan

---

- [ ] **1. Add new component-state token groups to `tokens.w3c.json`**

  Add `checkbox`, `radio`, `slider`, `tabs`, `accordion`, `pagination`, `tooltip`, and `dropdown`
  groups under both `color.component.light` and `color.component.dark` using the exact values from
  the table above. Preserve the existing `button`, `input`, `card`, `badge`, `select`, `switch`
  groups untouched. Keep the one-token-per-line object layout style consistent with existing entries.

  **Files:** `packages/tokens/src/tokens.w3c.json`

  **Verify:** Run `node packages/tokens/scripts/build-w3c.mjs` from the workspace root and confirm:
  - Exit 0 with a count increase in light/dark entries (previously ~76 light / ~76 dark entries;
    new count should be ~76 + 40+ more).
  - `dist/w3c/tokens.css` contains `--ucl-checkbox-bg-checked`, `--ucl-tabs-trigger-active`,
    `--ucl-tooltip-bg`, `--ucl-dropdown-item-bg-hover` in both light and dark blocks.
  - `src/tokens.runtime.generated.ts` is regenerated.

---

- [ ] **2. Rebuild the W3C token artifacts**

  Run `node packages/tokens/scripts/build-w3c.mjs` to regenerate `dist/w3c/tokens.css`,
  `dist/w3c/tokens.ts`, `dist/w3c/tokens.resolved.json`, and
  `src/tokens.runtime.generated.ts`. This step is a prerequisite for items 3, 5, and 6.

  **Files (auto-generated, no manual edit):**
  - `packages/tokens/dist/w3c/tokens.css`
  - `packages/tokens/dist/w3c/tokens.ts`
  - `packages/tokens/dist/w3c/tokens.resolved.json`
  - `packages/tokens/src/tokens.runtime.generated.ts`

  **Verify:** `pnpm --filter @ui-construction-library/tokens test` passes (existing snapshot tests in
  `packages/tokens/src/cssVariables.test.ts` should still pass — they test the legacy pipeline which
  is unmodified).

---

- [ ] **3. Update `components.css` — replace opacity hacks with component-state tokens on buttons**

  For each button variant currently using `opacity: 0.9` as a hover hack, replace with proper token
  consumption. The pattern is: the variant's base rule gets `background-color: var(--ucl-<variant>-default, <semantic-fallback>)` and the `:hover` rule sets `background-color: var(--ucl-<variant>-hover, <fallback>)`.
  Also add `:active` and `:focus-visible` rules using the `--ucl-button-*-active` / `--ucl-button-*-focus` tokens.

  **Exact current → target mapping for each button variant:**

  **`--default` variant (maps to `primary` token group):**
  ```css
  /* BEFORE */
  .ucl-button--default, .button--default {
    background-color: var(--primary);
    color: var(--primary-foreground);
    box-shadow: var(--shadow-sm);
  }
  .ucl-button--default:hover, .button--default:hover {
    opacity: 0.9;
  }

  /* AFTER */
  .ucl-button--default, .button--default {
    background-color: var(--ucl-button-primary-default, var(--primary));
    color: var(--ucl-button-primary-fg, var(--primary-foreground));
    box-shadow: var(--shadow-sm);
  }
  .ucl-button--default:hover:not(:disabled), .button--default:hover:not(:disabled) {
    background-color: var(--ucl-button-primary-hover, var(--primary));
  }
  .ucl-button--default:active:not(:disabled), .button--default:active:not(:disabled) {
    background-color: var(--ucl-button-primary-active, var(--primary));
  }
  .ucl-button--default:focus-visible, .button--default:focus-visible {
    background-color: var(--ucl-button-primary-focus, var(--primary));
  }
  .ucl-button--default:disabled, .button--default:disabled {
    background-color: var(--ucl-button-primary-disabled, var(--muted));
    opacity: 0.5; /* keep for cross-browser disabled visual */
  }
  ```

  **`--secondary` variant:**
  ```css
  /* BEFORE */
  .ucl-button--secondary, .button--secondary {
    background-color: var(--muted);
    color: var(--foreground);
    border-color: var(--border);
  }
  .ucl-button--secondary:hover, .button--secondary:hover {
    background-color: var(--accent);
  }

  /* AFTER */
  .ucl-button--secondary, .button--secondary {
    background-color: var(--ucl-button-secondary-default, var(--muted));
    color: var(--ucl-button-secondary-fg, var(--foreground));
    border-color: var(--border);
  }
  .ucl-button--secondary:hover:not(:disabled), .button--secondary:hover:not(:disabled) {
    background-color: var(--ucl-button-secondary-hover, var(--accent));
  }
  .ucl-button--secondary:active:not(:disabled), .button--secondary:active:not(:disabled) {
    background-color: var(--ucl-button-secondary-active, var(--accent));
  }
  ```

  **`--ghost` variant:**
  ```css
  /* BEFORE */
  .ucl-button--ghost, .button--ghost {
    background-color: transparent;
    color: var(--foreground);
  }
  .ucl-button--ghost:hover, .button--ghost:hover {
    background-color: var(--accent);
  }

  /* AFTER */
  .ucl-button--ghost, .button--ghost {
    background-color: var(--ucl-button-ghost-default, transparent);
    color: var(--ucl-button-ghost-fg, var(--foreground));
  }
  .ucl-button--ghost:hover:not(:disabled), .button--ghost:hover:not(:disabled) {
    background-color: var(--ucl-button-ghost-hover, var(--accent));
  }
  .ucl-button--ghost:active:not(:disabled), .button--ghost:active:not(:disabled) {
    background-color: var(--ucl-button-ghost-active, var(--accent));
  }
  ```

  **`--outline` variant:**
  ```css
  /* BEFORE */
  .ucl-button--outline, .button--outline {
    background-color: var(--background);
    color: var(--foreground);
    border-color: var(--input);
  }
  .ucl-button--outline:hover, .button--outline:hover {
    background-color: var(--accent);
    border-color: var(--border);
  }

  /* AFTER */
  .ucl-button--outline, .button--outline {
    background-color: var(--ucl-button-outline-default, var(--background));
    color: var(--ucl-button-outline-fg, var(--foreground));
    border-color: var(--ucl-input-border-default, var(--input));
  }
  .ucl-button--outline:hover:not(:disabled), .button--outline:hover:not(:disabled) {
    background-color: var(--ucl-button-outline-hover, var(--accent));
    border-color: var(--ucl-input-border-hover, var(--border));
  }
  .ucl-button--outline:active:not(:disabled), .button--outline:active:not(:disabled) {
    background-color: var(--ucl-button-outline-active, var(--accent));
  }
  ```

  **`--destructive`, `--success`, `--warning`, `--info` variants** — these have no component-state
  tokens in `tokens.w3c.json` (they map to semantic colors, not button-level tokens). Keep their
  base `background-color: var(--error|success|warning|info)` but replace the `opacity: 0.9` hack
  with a `filter: brightness(0.88)` rule that is theme-agnostic and works without new tokens:
  ```css
  /* BEFORE */
  .ucl-button--destructive:hover { opacity: 0.9; }

  /* AFTER */
  .ucl-button--destructive:hover:not(:disabled), .button--destructive:hover:not(:disabled) {
    filter: brightness(0.88);
  }
  .ucl-button--destructive:active:not(:disabled), .button--destructive:active:not(:disabled) {
    filter: brightness(0.80);
  }
  ```
  Apply the same `filter: brightness()` pattern to `--success`, `--warning`, `--info`.
  These can be promoted to real component-state tokens in a later pass (out of Ф3 scope).

  **Files:** `packages/core/src/styles/components.css`

  **Verify:** `pnpm --filter @ui-construction-library/core test` passes. Visually: a button using
  `--default` in Storybook should darken on hover to `#000000` (from `--ucl-button-primary-hover`)
  rather than fading.

---

- [ ] **4. Update `components.css` — input, select, textarea state tokens**

  Replace `var(--input)` border and `var(--background)` background in input/select/textarea rules
  with their explicit `--ucl-input-border-*` and `--ucl-input-bg-*` state tokens. Add `:hover` and
  `:focus` rules that use tokens.

  **Exact current → target mapping:**

  **Base input/select/textarea rule:**
  ```css
  /* BEFORE */
  .ucl-input, .input, .ucl-select, .select, .ucl-textarea, .textarea {
    border: 1px solid var(--input);
    background-color: var(--background);
    color: var(--foreground);
    ...
  }

  /* AFTER */
  .ucl-input, .input, .ucl-select, .select, .ucl-textarea, .textarea {
    border: 1px solid var(--ucl-input-border-default, var(--input));
    background-color: var(--ucl-input-bg-default, var(--background));
    color: var(--ucl-input-fg, var(--foreground));
    ...
  }
  ```

  **Add hover rule (currently missing):**
  ```css
  .ucl-input:hover:not(:disabled):not(:focus),
  .input:hover:not(:disabled):not(:focus),
  .ucl-select:hover:not(:disabled):not(:focus),
  .select:hover:not(:disabled):not(:focus),
  .ucl-textarea:hover:not(:disabled):not(:focus),
  .textarea:hover:not(:disabled):not(:focus) {
    border-color: var(--ucl-input-border-hover, var(--border));
  }
  ```

  **Focus rule** (currently uses `var(--ring)`):
  ```css
  /* BEFORE */
  .ucl-input:focus, ... {
    border-color: var(--ring);
    box-shadow: 0 0 0 1px var(--ring);
  }

  /* AFTER */
  .ucl-input:focus, ... {
    outline: none;
    border-color: var(--ucl-input-border-focus, var(--ring));
    box-shadow: 0 0 0 1px var(--ucl-input-ring, var(--ring));
  }
  ```

  **Error state:**
  ```css
  /* BEFORE */
  .ucl-input--error, ... { border-color: var(--error); }

  /* AFTER */
  .ucl-input--error, ... { border-color: var(--ucl-input-border-error, var(--error)); }
  ```

  **Placeholder:**
  ```css
  /* BEFORE */
  .ucl-input::placeholder, ... { color: var(--muted-foreground); }

  /* AFTER */
  .ucl-input::placeholder, ... { color: var(--ucl-input-placeholder, var(--muted-foreground)); }
  ```

  **Disabled:**
  ```css
  /* BEFORE */
  .ucl-input:disabled, ... { opacity: 0.5; cursor: not-allowed; }

  /* AFTER */
  .ucl-input:disabled, ... {
    background-color: var(--ucl-input-bg-disabled, var(--muted));
    border-color: var(--ucl-input-border-disabled, var(--border));
    opacity: 0.6;   /* slightly more visible than 0.5 */
    cursor: not-allowed;
  }
  ```

  **Files:** `packages/core/src/styles/components.css`

  **Verify:** `pnpm --filter @ui-construction-library/core test` passes.

---

- [ ] **5. Update `components.css` — checkbox, radio state tokens**

  Replace hardcoded `var(--primary)` / `var(--input)` / `var(--background)` in checkbox and radio
  rules with the new `--ucl-checkbox-*` and `--ucl-radio-*` tokens.

  **Checkbox current → target:**
  ```css
  /* BEFORE */
  .checkbox-box {
    border: 1px solid var(--input);
    background: var(--background);
  }
  .checkbox-box:checked {
    border-color: var(--primary);
    background: var(--primary);
  }
  .checkbox-box + svg { color: var(--primary-foreground); }

  /* AFTER */
  .checkbox-box {
    border: 1px solid var(--ucl-checkbox-border-default, var(--input));
    background: var(--ucl-checkbox-bg-unchecked, var(--background));
  }
  .checkbox-box:hover:not(:disabled) {
    border-color: var(--ucl-checkbox-border-hover, var(--border));
  }
  .checkbox-box:checked {
    border-color: var(--ucl-checkbox-border-checked, var(--primary));
    background: var(--ucl-checkbox-bg-checked, var(--primary));
  }
  .checkbox-box:disabled {
    background: var(--ucl-checkbox-bg-disabled, var(--muted));
    border-color: var(--ucl-checkbox-border-disabled, var(--border));
    opacity: 0.6;
    cursor: not-allowed;
  }
  .checkbox-box + svg { color: var(--ucl-checkbox-fg, var(--primary-foreground)); }
  ```

  **Radio current → target:**
  ```css
  /* BEFORE */
  .radio-input {
    accent-color: var(--primary);
  }

  /* AFTER */
  .radio-input {
    accent-color: var(--ucl-radio-accent, var(--primary));
  }
  ```
  Note: `accent-color` is the only controllable CSS property for native `<input type="radio">`.
  The `border` and `hover` tokens are defined for custom-styled radio (used in compound components).

  **Files:** `packages/core/src/styles/components.css`

  **Verify:** `pnpm --filter @ui-construction-library/core test` passes.

---

- [ ] **6. Update `components.css` — slider, tabs, accordion, pagination, tooltip, dropdown**

  Apply the new component-state tokens to the remaining six component groups. Follow the same
  `var(--ucl-<comp>-<state>, <semantic-fallback>)` pattern throughout.

  **Slider:**
  ```css
  /* track: BEFORE */ .slider__track { background: var(--muted); }
  /* AFTER */          .slider__track { background: var(--ucl-slider-track-bg, var(--muted)); }

  /* range: BEFORE */ .slider__range { background: var(--primary); }
  /* AFTER */          .slider__range { background: var(--ucl-slider-range-bg, var(--primary)); }

  /* thumb: BEFORE */ .slider__thumb { border: 1px solid var(--primary); background: var(--card); }
  /* AFTER */         .slider__thumb {
                        border: 1px solid var(--ucl-slider-thumb-border, var(--primary));
                        background: var(--ucl-slider-thumb-bg, var(--card));
                      }
  /* thumb hover — new rule: */
  .slider__thumb:hover { border-color: var(--ucl-slider-thumb-hover, var(--primary)); }
  ```

  **Tabs:**
  ```css
  /* list BEFORE */   .tabs-list { background: var(--muted); }
  /* AFTER */         .tabs-list { background: var(--ucl-tabs-list-bg, var(--muted)); }

  /* trigger BEFORE */ .tabs-trigger { color: var(--muted-foreground); }
  /* AFTER */          .tabs-trigger {
                         background: var(--ucl-tabs-trigger-default, transparent);
                         color: var(--ucl-tabs-trigger-fg-default, var(--muted-foreground));
                       }
  /* trigger hover — new rule: */
  .tabs-trigger:hover:not([data-state='active']) {
    background: var(--ucl-tabs-trigger-hover, var(--accent));
  }

  /* active BEFORE */ .tabs-trigger[data-state='active'] { background: var(--card); color: var(--foreground); }
  /* AFTER */         .tabs-trigger[data-state='active'] {
                        background: var(--ucl-tabs-trigger-active, var(--card));
                        color: var(--ucl-tabs-trigger-fg-active, var(--foreground));
                      }
  ```

  **Accordion:**
  ```css
  /* item border BEFORE */ .accordion-item { border-bottom: 1px solid var(--border); }
  /* AFTER */              .accordion-item { border-bottom: 1px solid var(--ucl-accordion-border, var(--border)); }

  /* trigger BEFORE */ .accordion-trigger { color: var(--foreground); }
  /* AFTER */          .accordion-trigger {
                         background: var(--ucl-accordion-trigger-default, transparent);
                         color: var(--ucl-accordion-trigger-fg, var(--foreground));
                       }
  /* trigger hover — new rule: */
  .accordion-trigger:hover {
    background: var(--ucl-accordion-trigger-hover, var(--accent));
  }

  /* content BEFORE */ .accordion-content { color: var(--muted-foreground); }
  /* AFTER */          .accordion-content { color: var(--ucl-accordion-content-fg, var(--muted-foreground)); }
  ```

  **Pagination:**
  ```css
  /* btn BEFORE */ .pagination-btn { background-color: var(--background); color: var(--foreground); border: 1px solid var(--border); }
  /* AFTER */      .pagination-btn {
                     background-color: var(--ucl-pagination-btn-bg, var(--background));
                     color: var(--ucl-pagination-btn-fg, var(--foreground));
                     border: 1px solid var(--ucl-pagination-btn-border, var(--border));
                   }
  /* hover BEFORE */ .pagination-btn:hover:not(:disabled) { background-color: var(--accent); }
  /* AFTER */        .pagination-btn:hover:not(:disabled) {
                       background-color: var(--ucl-pagination-btn-bg-hover, var(--accent));
                     }
  /* active BEFORE */ .pagination-btn--active { border-color: var(--primary); background-color: var(--primary); color: var(--primary-foreground); }
  /* AFTER */         .pagination-btn--active {
                        border-color: var(--ucl-pagination-btn-bg-active, var(--primary));
                        background-color: var(--ucl-pagination-btn-bg-active, var(--primary));
                        color: var(--ucl-pagination-btn-fg-active, var(--primary-foreground));
                      }
  ```

  **Tooltip:**
  ```css
  /* bubble BEFORE */ .tooltip-bubble { background: var(--foreground); color: var(--background); }
  /* AFTER */         .tooltip-bubble {
                        background: var(--ucl-tooltip-bg, var(--foreground));
                        color: var(--ucl-tooltip-fg, var(--background));
                        border: 1px solid var(--ucl-tooltip-border, transparent);
                      }
  ```

  **Dropdown (trigger and menu items):**
  ```css
  /* trigger BEFORE */ .dropdown-trigger { background-color: var(--background); border: 1px solid var(--border); }
  /* AFTER */          .dropdown-trigger {
                         background-color: var(--ucl-dropdown-trigger-bg, var(--background));
                         border: 1px solid var(--ucl-dropdown-trigger-border, var(--border));
                       }
  /* trigger hover — new rule: */
  .dropdown-trigger:hover:not(:disabled) {
    background-color: var(--ucl-dropdown-trigger-bg-hover, var(--accent));
  }

  /* menu BEFORE */ .dropdown-menu { background-color: var(--popover); }
  /* AFTER */       .dropdown-menu { background-color: var(--ucl-dropdown-menu-bg, var(--popover)); }

  /* item default BEFORE */ .dropdown-menu__item { /* no background */ }
  /* AFTER */               .dropdown-menu__item {
                              background-color: var(--ucl-dropdown-item-bg-default, transparent);
                              color: var(--ucl-dropdown-item-fg, var(--foreground));
                            }
  /* item hover BEFORE */ .dropdown-menu__item:hover, .dropdown-menu__item:focus { background-color: var(--accent); color: var(--foreground); }
  /* AFTER */             .dropdown-menu__item:hover, .dropdown-menu__item:focus {
                            background-color: var(--ucl-dropdown-item-bg-hover, var(--accent));
                            color: var(--ucl-dropdown-item-fg, var(--foreground));
                          }
  /* item active BEFORE */ .dropdown-menu__item--active { background-color: var(--primary); color: var(--primary-foreground); }
  /* AFTER */              .dropdown-menu__item--active {
                             background-color: var(--ucl-dropdown-item-bg-active, var(--primary));
                             color: var(--ucl-dropdown-item-fg-active, var(--primary-foreground));
                           }
  /* destructive BEFORE */ .dropdown-menu__item--destructive { color: var(--error); }
  /* AFTER */              .dropdown-menu__item--destructive {
                             color: var(--ucl-dropdown-item-fg-destructive, var(--error));
                           }
  /* destructive hover BEFORE */ .dropdown-menu__item--destructive:hover { background-color: color-mix(in srgb, var(--error) 10%, transparent); color: var(--error); }
  /* AFTER */                    .dropdown-menu__item--destructive:hover,
                                 .dropdown-menu__item--destructive:focus {
                                   background-color: var(--ucl-dropdown-item-bg-destructive-hover, color-mix(in srgb, var(--error) 10%, transparent));
                                   color: var(--ucl-dropdown-item-fg-destructive, var(--error));
                                 }
  ```

  **Files:** `packages/core/src/styles/components.css`

  **Verify:** `pnpm --filter @ui-construction-library/core test` passes.

---

- [ ] **7. Fix `ButtonSize` in `packages/behaviors/src/button.ts`**

  **Current state:** `ButtonSize = 'default' | 'sm' | 'lg' | 'icon'`
  **Target state:** `ButtonSize = 'sm' | 'md' | 'lg' | 'icon'`

  Rationale: `'default'` size is redundant — the unsized base `.ucl-button` class handles the
  default. `'md'` is what `packages/core/src/types/component-types.ts` already declares. Aligning
  removes the mismatch flagged in audit finding #8. The `ButtonBehaviorOptions` in
  `behaviors/src/button.ts` must also update its `size` field.

  **Change in `createButtonBehavior`:** The size→class mapping should map `'md'` to no additional
  class (same as the default), keeping the existing `size !== 'default'` guard but replacing it with
  `size !== 'md'`:
  ```ts
  // BEFORE
  const className = cx(
    'ucl-button',
    `ucl-button--${variant}`,
    size !== 'default' && `ucl-button--${size}`
  );

  // AFTER
  const className = cx(
    'ucl-button',
    `ucl-button--${variant}`,
    size !== 'md' && `ucl-button--${size}`
  );
  ```

  **Change in `packages/core/src/types/component-types.ts`:** The `ButtonSize` there already has
  `'sm' | 'md' | 'lg'` — it is missing `'icon'`. Add `'icon'` to align with the behaviors export:
  ```ts
  // BEFORE
  export type ButtonSize = 'sm' | 'md' | 'lg';
  // AFTER
  export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
  ```

  **Add `.ucl-button--md` CSS rule** (alias to no-op — base sizing already covers `md`, but an
  explicit class makes `size="md"` work consistently):
  ```css
  /* after .ucl-button--icon rule in components.css */
  .ucl-button--md, .button--md {
    /* inherits base .ucl-button sizing — no overrides */
  }
  ```

  **Update `behaviors.test.ts`** — the test `'sets loading and disabled when loading'` passes
  `size: 'lg'` which is still valid. The test for `className` with `size: 'default'` (if any) needs
  updating to `size: 'md'`. Check: current test passes `size: 'lg'` only — no change needed there.
  However, the test `'returns empty attrs when no options'` expects:
  ```
  className === 'ucl-button ucl-button--default'
  ```
  This test is for the variant default (not size default), so it remains correct.

  **Files:**
  - `packages/behaviors/src/button.ts`
  - `packages/core/src/types/component-types.ts`
  - `packages/core/src/styles/components.css`

  **Verify:**
  ```
  pnpm --filter @ui-construction-library/behaviors test
  pnpm --filter @ui-construction-library/core typecheck
  ```
  All existing behavior tests pass without modification.

---

- [ ] **8. Update switch in `components.css` to use `--ucl-switch-*` tokens (already generated)**

  The switch tokens already exist in `tokens.w3c.json` and are generated. Wire them into the
  existing CSS rules which currently use `var(--border)`, `var(--primary)`, `var(--card)`.

  ```css
  /* BEFORE */
  .switch { background: var(--border); }
  .switch[data-state='checked'] { background: var(--primary); }
  .switch-thumb { background: var(--card); }

  /* AFTER */
  .switch { background: var(--ucl-switch-track-off, var(--border)); }
  .switch[data-state='checked'] { background: var(--ucl-switch-track-on, var(--primary)); }
  .switch:disabled, .switch[data-disabled] {
    background: var(--ucl-switch-track-disabled, var(--muted));
    opacity: 0.6;
    cursor: not-allowed;
  }
  .switch-thumb { background: var(--ucl-switch-thumb, var(--card)); }
  ```

  **Files:** `packages/core/src/styles/components.css`

  **Verify:** `pnpm --filter @ui-construction-library/core test` passes.

---

- [ ] **9. Run full token build and update snapshots if any**

  Run `pnpm --filter @ui-construction-library/tokens build:w3c` once more as a final clean pass,
  then run the tokens test suite. If `cssVariables.test.ts` has snapshots that reference the
  generated output, update them with `pnpm --filter @ui-construction-library/tokens test -- -u`.

  **Verify:**
  ```
  pnpm --filter @ui-construction-library/tokens test
  pnpm --filter @ui-construction-library/behaviors test
  pnpm --filter @ui-construction-library/core test
  pnpm --filter @ui-construction-library/core typecheck
  pnpm --filter @ui-construction-library/behaviors typecheck
  ```
  All pass with exit code 0.

---

- [ ] **10. Commit**

  Stage and commit all changed and generated files on the current branch:
  ```
  git add packages/tokens/src/tokens.w3c.json \
          packages/tokens/src/tokens.runtime.generated.ts \
          packages/tokens/dist/w3c/ \
          packages/core/src/styles/components.css \
          packages/core/src/types/component-types.ts \
          packages/behaviors/src/button.ts
  git commit -m "feat(tokens,core,behaviors): Ф3 — component-state tokens wired to components

  - Add checkbox, radio, slider, tabs, accordion, pagination, tooltip,
    dropdown component-state token groups to tokens.w3c.json (light+dark)
  - Rebuild W3C artifacts (tokens.css, tokens.ts, tokens.runtime.generated.ts)
  - Replace opacity: 0.9 hover hacks in components.css with --ucl-button-*
    state tokens; add :active state rules
  - Wire --ucl-input-*, --ucl-checkbox-*, --ucl-radio-*, --ucl-switch-*,
    --ucl-slider-*, --ucl-tabs-*, --ucl-accordion-*, --ucl-pagination-*,
    --ucl-tooltip-*, --ucl-dropdown-* tokens into components.css
  - Fix ButtonSize: align behaviors/src/button.ts ('sm'|'md'|'lg'|'icon')
    with core/types/component-types.ts; add icon size support

  BREAKING CHANGE: ButtonSize 'default' removed; use 'md'. CSS button hover
  states now change background-color rather than opacity."
  ```

---

## Dependency Order Summary

```
1 → 2 (artifacts regenerated)
    2 → 3, 4, 5, 6, 8 (all CSS updates depend on tokens being built so names are confirmed)
7 is independent (TypeScript-only change in behaviors + types)
3, 4, 5, 6, 7, 8 → 9 (final test run)
9 → 10 (commit only after tests pass)
```

Items 3–8 can be done in any order after step 2 — they all modify the same `components.css` file
sequentially. Do them in order 3→4→5→6→7→8 to match the file's top-to-bottom layout.

---

## Out of Scope for Ф3

- `--destructive`, `--success`, `--warning`, `--info` dedicated component-state token groups
  (added only to semantic layer, not component tier — `filter: brightness()` is the interim solution)
- Full migration to `tailwind-variants` (`tv`) — that is Ф4
- The Tailwind `@theme` bridge — that is Ф5
- `asChild`/Slot polyphorphism — that is Ф5
- The `globals.css` legacy alias layer cleanup — targeted for Ф4 when the full migration happens
