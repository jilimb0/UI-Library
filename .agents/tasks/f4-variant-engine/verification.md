# Ф4 — Verification Record

Repo: `/Users/jilimbo/Documents/Personal/core-infra/UI-Library`
Branch: `main` (first iteration — `review.json` did not exist).

All commands run from the repo root unless noted. `pnpm build` (Rollup) was
NOT run, per the brief (typecheck + test only).

## Pre-flight: tailwind-variants linkage

- `pnpm-workspace.yaml` catalog got `tailwind-variants: ^3.1.0` (unquoted).
- `packages/core/package.json` deps got `"tailwind-variants": "catalog:"`
  (alphabetically after `tailwind-merge`).

### Check 1 — `pnpm install` succeeds (tailwind-variants linked)

Command: `pnpm install`

```
...
Packages: +1
+
Progress: resolved 931, reused 94, downloaded 654, added 1, done
. prepare$ husky
. prepare: Done
Done in 29.3s using pnpm v11.7.0
```

Exit code: 0. +1 package added.

Linked version check (catalog `^3.1.0` resolved to 3.3.1):

```
$ cat packages/core/node_modules/tailwind-variants/package.json | grep version
  "version": "3.3.1",

$ grep -n "tailwind-variants" pnpm-lock.yaml | head
15:    tailwind-variants:
604:      tailwind-variants:
5347:  tailwind-variants@3.3.1:
9873:  tailwind-variants@3.3.1(tailwind-merge@2.6.1)(tailwindcss@4.3.0):
```

Result: PASS — install exits 0, `tailwind-variants@3.3.1` linked into core.

## Verification gate

### Check 2 — core typecheck (0 errors)

Command: `pnpm --filter @ui-construction-library/core typecheck`
(== `tsc --noEmit`)

```
$ tsc --noEmit
```

Exit code: 0. No diagnostics emitted. (Only pre-existing Node engine
`[WARN]` lines — wanted `>=26.0.0`, current `v24.13.1` — unrelated to Ф4.)

Result: PASS — 0 errors.

### Check 3 — `pnpm lint` (0 errors; warnings OK)

`pnpm format` (`biome format --write .`) ran first and "Fixed 1 file".
Then `pnpm --filter @ui-construction-library/core lint:fix`
(`biome check --write src`) applied the one fixable organize-exports fix in
`utils/cn.ts` (relative re-export moved last). Re-ran `pnpm lint`:

Command: `pnpm lint`

```
Checked 1113 files in 221ms. No fixes applied.
Found 2 warnings.
```

Exit code: 0. The 2 warnings are pre-existing
`no-assign-to-document-cookie` notes in a theme test
(`packages/core/src/.../ThemeProvider`-related test writes `document.cookie`)
and are unrelated to Ф4. No errors.

Result: PASS — 0 errors (2 pre-existing warnings, unrelated).

### Check 4 — core tests (Badge/Button/Card pass; no regression)

Command: `pnpm --filter @ui-construction-library/core test`
(== `vitest run --config ./vitest.config.ts src`)

```
 RUN  v4.1.6 /Users/.../packages/core
 Test Files  98 passed (98)
      Tests  338 passed (338)
   Start at  01:23:25
   Duration  7.29s (transform 8.56s, setup 12.71s, import 24.30s, tests 4.38s, environment 24.51s)
```

Exit code: 0. All 98 test files / 338 tests pass, including:
- `Badge.test.tsx` (renders, axe, `it.each` asserting `badge--default` /
  `badge--success` / `badge--warning` / `badge--error` / `badge--info` via
  `toHaveClass`) and `Badge.a11y.test.tsx`.
- `Button.test.tsx` (renders children, click handler) and
  `Button.a11y.test.tsx` (aria-label + Enter-key keyboard activation via
  `handlers.onKeyDown`, which is still spread on the element).
- `Card.test.tsx` (renders + axe).

Result: PASS — Badge/Button/Card pass, full suite green, no regression.

### Check 5 — CVA import gone from Badge (0 matches)

Command:
`grep "from 'class-variance-authority'" packages/core/src/components/atoms/Badge/Badge.tsx`

```
$ grep -c "from 'class-variance-authority'" packages/core/src/components/atoms/Badge/Badge.tsx
0
```

Result: PASS — 0 matches (Badge migrated off CVA).

### Check 6 — `tv(` present in Badge

Command: `grep -n "tv(" packages/core/src/components/atoms/Badge/Badge.tsx`

```
5:const badgeVariants = tv({
```

Result: PASS — match found.

### Check 7 — `tv(` present in Button

Command: `grep -n "tv(" packages/core/src/components/atoms/Button/Button.tsx`

```
12:const buttonVariants = tv({
```

Result: PASS — match found.

### Check 8 — `tv(` present in Card

Command: `grep -n "tv(" packages/core/src/components/molecules/Card/Card.tsx`

```
4:const cardVariants = tv({
```

Result: PASS — match found.

## Class-string equivalence (runtime evidence)

Ran a throwaway script (`packages/core/_tv-check.mjs`, deleted after) that
imports the real `tailwind-variants` and re-declares the three configs to log
resolved class strings:

```
Badge default       : badge badge--default
Badge success       : badge badge--success
Badge error+cls     : badge badge--error extra
Button default      : ucl-button ucl-button--default ucl-button--md
Button secondary sm : ucl-button ucl-button--secondary ucl-button--sm
Button destr+icon   : ucl-button ucl-button--destructive ucl-button--icon ucl-button--destructive-icon
Button default+cls  : ucl-button ucl-button--default ucl-button--md extra
Card default        : card card--flat
Card raised        : card card--raised
Card interactive    : card card--flat card--interactive
Card glass+inter    : card card--glass card--interactive
Card +cls          : card card--flat extra
```

Notes on equivalence:
- Badge class strings are byte-identical to the prior CVA config.
- Button variant/size/compound class strings match the brief's tv config
  verbatim. Default size now also emits `ucl-button--md`; per the plan this is
  a CSS no-op (`components.css` line ~53: `.ucl-button--md, .button--md` is an
  empty `/* md is the base size */` rule), so visual output is unchanged.
  This is the brief's explicitly-specified config, not a deviation.
- Card default elevation changed `raised → flat` and the `overlay` value
  became `glass` per the brief's `defaultVariants: { elevation: 'flat' }` and
  the new `'flat' | 'raised' | 'glass'` type. No `.card--flat` / `.card--raised`
  / `.card--overlay` / `.card--glass` selectors exist in the CSS (only base
  `.card`), and no consumer passes `elevation` (only `data-elevation` set
  internally by Card.tsx), so this is visually inert. Brief-permitted API
  normalization.
- `className` passthrough works via `cn()` (twMerge + clsx); consumer classes
  append correctly (e.g. `extra`).

## Constraints retained

- `class-variance-authority` is still a dependency of `packages/core` and is
  still imported directly by 7 unchanged components (Text, TextArea, Tag,
  Dropdown, Popover, Modal, Slider) — verified:
  ```
  $ grep -rl "from 'class-variance-authority'" packages/core/src/components/
  packages/core/src/components/molecules/Dropdown/Dropdown.tsx
  packages/core/src/components/molecules/Slider/Slider.tsx
  packages/core/src/components/molecules/Popover/Popover.tsx
  packages/core/src/components/atoms/TextArea/TextArea.tsx
  packages/core/src/components/atoms/Text/Text.tsx
  packages/core/src/components/atoms/Tag/Tag.tsx
  packages/core/src/components/organisms/Modal/Modal.tsx
  ```
- `createButtonBehavior` from `@ui-construction-library/behaviors` is still
  imported and used in `Button.tsx` for ARIA attrs (`role`, `aria-disabled`,
  `aria-busy`, `data-disabled`, `data-loading`, `data-variant`, `data-size`)
  and event handlers (`onClick`, `onKeyDown` keyboard activation) — only its
  visual `className` is no longer consumed:
  ```
  1:import { createButtonBehavior } from '@ui-construction-library/behaviors';
  101:    const { attrs, handlers } = createButtonBehavior({
  ```
- All existing semantic CSS class names are preserved (`badge`,
  `badge--success`, `ucl-button`, `ucl-button--secondary`, `card`,
  `card--interactive`, etc.); only the JS variant engine changed (CVA/cx → tv).
- 80-char line width and single quotes enforced by Biome; `pnpm lint` clean.

## Summary of gate results

| # | Check | Result |
|---|-------|--------|
| 1 | `pnpm install` (tailwind-variants linked) | PASS |
| 2 | core typecheck — 0 errors | PASS |
| 3 | `pnpm lint` — 0 errors | PASS |
| 4 | core test — Badge/Button/Card pass, 338/338 | PASS |
| 5 | CVA import in Badge — 0 matches | PASS |
| 6 | `tv(` in Badge | PASS |
| 7 | `tv(` in Button | PASS |
| 8 | `tv(` in Card | PASS |

All 8 checks pass.
