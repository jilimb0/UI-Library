# Ф4 Review — Unified Variant Engine (tailwind-variants)

Reviewed against: the Ф4 brief and
`.agents/tasks/f4-variant-engine/plan.md`.
Verification evidence read from
`.agents/tasks/f4-variant-engine/verification.md` (not re-run).

## Method

Read the diff and all changed files: `variants.ts`, `cn.ts`,
`component-props.ts`, `component-types.ts`, `Badge.tsx`, `Button.tsx`,
`Card.tsx`, plus `pnpm-workspace.yaml` and `packages/core/package.json` via
grep, and the git commit (`git show --stat`, `git log -1`, `git status`).
Ran two narrow spot-checks on the Card elevation normalization (the one place
the brief's own config deviates from "identical class strings"):
(1) no CSS selector keys off `card--overlay|flat|raised|glass|interactive`
for the Card molecule (only an unrelated `.kpi-card--interactive` matched);
(2) no consumer passes `elevation="overlay"` or `"raised"`. Both confirm the
Card change is visually inert and consumer-free.

## Findings — blockers

None.

## Checklist verification

- **tailwind-variants in catalog + core deps, install OK.** Catalog has
  `tailwind-variants: ^3.1.0` (unquoted, matching `react: ^18.3.1` style);
  `packages/core/package.json` deps have `"tailwind-variants": "catalog:"`
  alphabetically after `tailwind-merge`. Verification Check 1: `pnpm install`
  exit 0, +1 package, `tailwind-variants@3.3.1` linked into core.
- **variants.ts + cn.ts.** `variants.ts` is exactly
  `export { tv, type VariantProps } from 'tailwind-variants';`. `cn.ts` now has
  `export { tv, type VariantProps } from './variants';` and no longer
  re-exports CVA. This is a documented deviation from the brief's literal
  "add" wording, but necessary: `cn.ts` previously exported
  `export { cva, type VariantProps } from 'class-variance-authority'`, and two
  same-named `VariantProps` exports in one module is a compile error. The
  plan verified zero files import `cva`/`VariantProps` from `utils/cn` (all
  7 CVA components import directly from `class-variance-authority`), so the
  dropped re-export is dead code. `class-variance-authority` stays in
  `package.json` (`^0.7.1`) and is still imported directly by Text, TextArea,
  Tag, Dropdown, Popover, Modal, Slider — satisfies "do NOT remove CVA".
- **component-props.ts.** Created with `UCLComponentProps` and `ComponentSize`;
  re-exported from `component-types.ts` via
  `export type { ComponentSize, UCLComponentProps } from './component-props';`.
  Imports only `ReactNode` (the brief's snippet listed an unused
  `HTMLAttributes`); cleaner, not a behavioral change.
- **Badge (CVA → tv).** Imports `tv, type VariantProps` from
  `../../../utils/variants`. `badgeVariants = tv({ base: 'badge', variants:
  { variant: { default/success/warning/error/info → badge--* } },
  defaultVariants: { variant: 'default' } })` — class strings byte-identical
  to the prior CVA config. `BadgeVariants = VariantProps<typeof
  badgeVariants>`; `BadgeProps extends HTMLAttributes<HTMLSpanElement>,
  BadgeVariants`. Render body unchanged (`cn(badgeVariants({ variant,
  className }))`, `data-variant={variant}`). Verification Check 5: CVA import
  in Badge → 0 matches. Check 6: `tv(` present.
- **Button (tv + behaviors).** `buttonVariants = tv({ base: 'ucl-button',
  variants: { variant: 9 values, size: sm/md/lg/icon }, defaultVariants:
  { variant: 'default', size: 'md' }, compoundVariants: [ { variant:
  'destructive', size: 'icon', class: 'ucl-button--destructive-icon' } ] })` —
  matches the brief verbatim. `createButtonBehavior` still imported and used:
  `const { attrs, handlers } = createButtonBehavior({...})` (className not
  destructured); `{...attrs}` and `{...handlers}` spread on the element, so
  keyboard-activation a11y (`handlers.onKeyDown`) is preserved.
  `className={cn(buttonVariants({ variant, size, className }))}`.
  `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants>`. `ButtonVariant`/`ButtonSize` removed
  from the `component-types` import (now tv-derived). Exports
  `{ Button, buttonVariants }`. Verification Check 7: `tv(` present; typecheck
  0 errors; Button + Button.a11y tests pass.
- **Card (tv with slots).** `cardVariants = tv({ base: 'card', variants:
  { elevation: { flat/raised/glass → card--* }, interactive: { true:
  'card--interactive' } }, defaultVariants: { elevation: 'flat' } })`.
  `CardProps.elevation?: 'flat' | 'raised' | 'glass'` (was `'flat' | 'raised'
  | 'overlay'`); default destructure changed `raised → flat`. Render uses
  `cn(cardVariants({ elevation, interactive, className }))`;
  `data-elevation={elevation}` and `data-interactive={...}` kept. The
  `overlay → glass` rename and `raised → flat` default change are explicit
  in the brief's own tv config. Spot-checked: no CSS selector keys off these
  Card classes and no consumer passes `elevation`, so the change is visually
  inert and consumer-free (brief-permitted API normalization). Verification
  Check 8: `tv(` present; Card + axe tests pass.
- **component-types.ts.** Derives
  `ButtonVariant = TvVariantProps<typeof buttonVariants>['variant']`,
  `ButtonSize = TvVariantProps<typeof buttonVariants>['size']`,
  `BadgeVariant = TvVariantProps<typeof badgeVariants>['variant']`. Uses
  `import type { VariantProps as TvVariantProps } from 'tailwind-variants'`
  (aliased — necessary, since the file keeps
  `import type { VariantProps } from 'class-variance-authority'` for the
  unchanged CVA-based types TextSize/TextWeight/TextArea*/Modal/Popover/
  Dropdown sizes). `ButtonBehaviorOptions`, `InputSize`, `SelectSize`, and
  the CVA-derived overlay sizes are unchanged. `ComponentSize` is the
  re-export, not redefined. `components/index.ts` re-export chain resolves
  (typecheck 0 errors).
- **CVA retained.** `class-variance-authority: ^0.7.1` still in core
  `package.json`; 7 components still import it directly (verification doc
  lists them).
- **CSS class names preserved.** Badge byte-identical; Button emits the
  brief's exact strings (default `ucl-button--md` is a CSS no-op per the
  plan, confirmed by the brief's own config); Card normalized per the
  brief's own config and CSS-inert. No semantic class removed.
- **Grep checklist (Checks 5-8).** CVA import in Badge → 0 matches; `tv(`
  present in Badge (line 5), Button (line 12), Card (line 4). All pass.
- **Verification gate.** Check 1 install exit 0; Check 2 typecheck 0 errors;
  Check 3 lint 0 errors (2 pre-existing `no-assign-to-document-cookie`
  warnings in an unrelated theme test); Check 4 tests 338/338 pass including
  Badge/Button/Card and their a11y tests. No regressions. `pnpm build`
  correctly not run.
- **Commit.** `git show --stat HEAD` lists exactly the 10 Ф4 files
  (workspace yaml, lockfile, core package.json, variants.ts, cn.ts,
  component-props.ts, component-types.ts, Badge/Button/Card). `biome.json`,
  `.agents/`, and `.kiro/` are NOT staged (still shown as modified/untracked
  in `git status`). Commit message is byte-exact.

## Documented deviations (non-blocking, justified)

1. **cn.ts: replaced, not added.** Adding the tv re-export alongside the
   existing CVA re-export would create two `VariantProps` exports in one
   module — a compile error. Replacing is the only compiling option; the
   CVA re-export had zero consumers.
2. **component-types.ts: aliased the tv import** as `TvVariantProps`. A bare
   `VariantProps` import would clash with the kept CVA `VariantProps` import
   used by the unchanged types.
3. **component-props.ts: imports only `ReactNode`.** The brief's snippet also
   listed `HTMLAttributes`, which is unused in `UCLComponentProps`.

All three are necessary correctness/cleanliness choices that preserve the
brief's intent (expose `tv`, derive types from tv configs, keep CVA
installed) and are documented in the plan. None introduce a reachable
correctness, security, or data failure.

## Verdict

APPROVED — no blockers remain. All Ф4 requirements are met, the
verification gate (install / typecheck / lint / test / 4 greps) is green per
the recorded evidence, and the commit is correctly scoped with the exact
message.
