# Implementation Plan — Ф4: Unified Variant Engine (tailwind-variants)

Goal: replace CVA/inline-cn class logic in Badge, Button, Card with
`tailwind-variants` (`tv`), keep CVA installed for the components that still
use it, and keep `createButtonBehavior` for the Button's ARIA/handlers. Class
strings stay identical (semantic classes that map to existing CSS).

Workspace root (absolute): `/Users/jilimbo/Documents/Personal/core-infra/UI-Library`
Use `git -C /Users/jilimbo/Documents/Personal/core-infra/UI-Library ...` for git.

## Key decisions (gaps in the brief, resolved from code I read)

- **cn.ts: replace the CVA re-export, don't add alongside.** The brief says
  "add `export { tv, type VariantProps } from './variants'` to cn.ts", but
  cn.ts already has `export { cva, type VariantProps } from
  'class-variance-authority'`. Two exports named `VariantProps` in one module
  is a compile error. I verified by grep that **zero** files import `cva` or
  `VariantProps` from `utils/cn` — every CVA component (Text, TextArea, Tag,
  Dropdown, Popover, Modal, Slider) imports `cva`/`VariantProps` **directly**
  from `'class-variance-authority'`. So the cn.ts CVA re-export is dead code.
  Decision: replace it with the tv re-export. The `class-variance-authority`
  package stays installed and is still imported directly by those components,
  satisfying "do NOT remove class-variance-authority". (This does drop `cva`
  and CVA-`VariantProps` from core's public re-export via `utils/index.ts`, but
  there are no in-repo consumers and breaking changes are allowed.)

- **component-types.ts: alias the tv import, don't reuse the `VariantProps`
  name.** The brief says `import type { VariantProps } from
  'tailwind-variants'`, but the file already has `import type { VariantProps }
  from 'class-variance-authority'` for the unchanged CVA-based types
  (TextSize, TextWeight, TextArea*, Modal/Popover/Dropdown size). Two
  same-named type imports conflict. Decision: keep the CVA import unchanged
  and add `import type { VariantProps as TvVariantProps } from
  'tailwind-variants'`; derive ButtonVariant/ButtonSize/BadgeVariant from
  `TvVariantProps<...>`.

- **Button size `md` now emits `ucl-button--md`.** The brief's tv config maps
  `size: { md: 'ucl-button--md' }`, but `createButtonBehavior` currently skips
  the size class when `size === 'md'`. After migration a default button gains
  `ucl-button--md`. I read components.css line 53: `.ucl-button--md, .button--md`
  is an empty rule (`/* md is the base size — no size overrides */`), so the
  added class is visually a no-op. Follow the brief's config verbatim.

- **Card elevation changes `overlay → glass` and default `raised → flat`.**
  The brief's tv config uses `elevation: { flat, raised, glass }` with
  `defaultVariants: { elevation: 'flat' }`, but the current Card type is
  `'flat' | 'raised' | 'overlay'` with default `'raised'`. I verified the CSS
  has **only** a base `.card` rule — no `.card--flat/.card--raised/.card--
  overlay/.card--glass/.card--interactive` classes exist anywhere, and
  `data-elevation` has no CSS selector. I also verified no story or consumer
  passes the `elevation` prop (only `data-elevation` appears, set by Card.tsx
  itself). So the type/default change is inert and breaks nothing. Follow the
  brief verbatim (this is an intentional API normalization; breaking OK).

- **component-props.ts: import only `ReactNode`.** The brief's snippet imports
  `HTMLAttributes, ReactNode` but `UCLComponentProps` as written uses only
  `ReactNode`. `HTMLAttributes` would be an unused import. `noUnusedImports`
  is `"warn"` (not an error, so it wouldn't fail `pnpm lint`), but dropping the
  unused import is cleaner. Decision: `import type { ReactNode } from 'react'`
  only.

- **Commit staging: explicit files only.** `git status` shows a pre-existing
  uncommitted `biome.json` change (adds `!**/*.generated.ts` to ignores — not
  part of Ф4) and untracked `.agents/` + `.kiro/` dirs. Neither `.agents` nor
  `.kiro` is gitignored (`git check-ignore` exits 1 for both). The commit step
  must stage the explicit Ф4 file list — **never** `git add -A`/`git add .` —
  so the unrelated `biome.json` change and the excluded dirs are not swept in.

- **Button keeps `createButtonBehavior` for ARIA + handlers, drops its
  className.** `createButtonBehavior` returns `{ attrs, className, handlers }`.
  We keep `{...attrs}` (role, aria-disabled, aria-busy, data-variant,
  data-size) and `{...handlers}` (onClick + onKeyDown keyboard activation —
  required by `Button.a11y.test.tsx`'s Enter-key test) but stop using its
  `className`; the visual classes come from `buttonVariants`.

---

# Implementation Plan

- [ ] 1. Add `tailwind-variants` to the pnpm catalog and to core's deps, then
      install.
      - What: In `pnpm-workspace.yaml` `catalog:` block add
        `tailwind-variants: ^3.1.0` (unquoted, matching the `react: ^18.3.1`
        style). In `packages/core/package.json` `dependencies` add
        `"tailwind-variants": "catalog:"` (runtime dep — components use it),
        placed alphabetically among the deps (after `tailwind-merge`).
        Then run `pnpm install` from the repo root to link it and update
        `pnpm-lock.yaml`. Keep `class-variance-authority` and `clsx`/`tailwind-
        merge` exactly as they are.
      - Files: `pnpm-workspace.yaml`, `packages/core/package.json`,
        `pnpm-lock.yaml` (auto-updated by install)
      - Verify: `pnpm install` exits 0; `node -e "require('tailwind-
        variants')"` run from `packages/core` resolves (or `ls node_modules/
        tailwind-variants` shows the package). `pnpm --filter
        @ui-construction-library/core typecheck` is deferred to step 9.

- [ ] 2. Create the unified variant helper module
      `packages/core/src/utils/variants.ts`.
      - What: New file with exactly:
        `export { tv, type VariantProps } from 'tailwind-variants';`
        (This is the single canonical source for tv; Badge imports from here.
        Single quotes, no trailing extra exports.)
      - Files: `packages/core/src/utils/variants.ts` (create)
      - Verify: `pnpm --filter @ui-construction-library/core typecheck`
        passes (run after later steps; this file alone has no consumers until
        steps 3-7). Quick sanity: the file exists and exports `tv`.

- [ ] 3. Update `packages/core/src/utils/cn.ts` to re-export tv instead of
      the dead CVA re-export.
      - What: Replace the line
        `export { cva, type VariantProps } from 'class-variance-authority';`
        with
        `export { tv, type VariantProps } from './variants';`
        Keep the other exports unchanged: `import { type ClassValue, clsx }
        from 'clsx';`, `import { twMerge } from 'tailwind-merge';`,
        `export { type ClassValue, clsx } from 'clsx';`,
        `export { twMerge } from 'tailwind-merge';`, and the `cn()` function.
        Do NOT remove `class-variance-authority` from package.json. Rationale
        per decision above: the CVA re-export has zero consumers and would
        otherwise conflict with tv's `VariantProps` name.
      - Files: `packages/core/src/utils/cn.ts`
      - Verify: `pnpm --filter @ui-construction-library/core typecheck`
        succeeds (run in step 9). Confirm no file in `packages/core/src`
        imports `cva`/`VariantProps` from `utils/cn` (none do — verified
        during planning) so nothing breaks from dropping that re-export.

- [ ] 4. Create the shared base-props module
      `packages/core/src/types/component-props.ts` and re-export it from
      component-types.
      - What: New file `packages/core/src/types/component-props.ts`:
        ```ts
        import type { ReactNode } from 'react';

        export interface UCLComponentProps {
          className?: string;
          children?: ReactNode;
        }

        export type ComponentSize = 'sm' | 'md' | 'lg';
        ```
        Then in `packages/core/src/types/component-types.ts` remove the local
        `export type ComponentSize = 'sm' | 'md' | 'lg';` line and add a
        re-export instead:
        `export type { ComponentSize, UCLComponentProps } from
        './component-props';`
        (so both types reach the public API through the existing
        `types/index.ts` → `export * from './component-types'` chain, and
        `components/index.ts`'s `ComponentSize` re-export from `../types`
        keeps working).
      - Files: `packages/core/src/types/component-props.ts` (create),
        `packages/core/src/types/component-types.ts` (modify — only the
        ComponentSize definition/re-export in this step; ButtonVariant/etc.
        come in step 8)
      - Verify: `pnpm --filter @ui-construction-library/core typecheck`
        passes; `grep -n "ComponentSize" packages/core/src/components/index.ts`
        still shows it re-exported and resolves.

- [ ] 5. Migrate Badge from CVA to tv.
      - What: In `packages/core/src/components/atoms/Badge/Badge.tsx`:
        - Change the import
          `import { cva, type VariantProps } from 'class-variance-authority';`
          to
          `import { tv, type VariantProps } from
          '../../../utils/variants';`.
        - Keep `import { cn } from '../../../utils/cn';`.
        - Replace
          `const badgeVariants = cva('badge', { variants: { variant: { ... }
          }, defaultVariants: { variant: 'default' } });`
          with
          ```ts
          const badgeVariants = tv({
            base: 'badge',
            variants: {
              variant: {
                default: 'badge--default',
                success: 'badge--success',
                warning: 'badge--warning',
                error: 'badge--error',
                info: 'badge--info',
              },
            },
            defaultVariants: {
              variant: 'default',
            },
          });
          ```
          (identical class strings; only the engine and `base` key change).
        - Add `type BadgeVariants = VariantProps<typeof badgeVariants>;` and
          change `export interface BadgeProps extends
          HTMLAttributes<HTMLSpanElement>, VariantProps<typeof
          badgeVariants> {}` to `export interface BadgeProps extends
          HTMLAttributes<HTMLSpanElement>, BadgeVariants {}`.
        - Keep the render body EXACTLY as-is: `forwardRef<HTMLSpanElement,
          BadgeProps>(({ className, variant, style, ...props }, ref) => <span
          ref={ref} className={cn(badgeVariants({ variant, className }))}
          style={style} data-variant={variant} {...props} />)`, `Badge.display
          Name = 'Badge'`, and `export { Badge, badgeVariants };`.
      - Files: `packages/core/src/components/atoms/Badge/Badge.tsx`
      - Verify: `pnpm --filter @ui-construction-library/core typecheck` passes;
        `pnpm --filter @ui-construction-library/core test` — `Badge.test.tsx`
        passes (it uses `toHaveClass` presence checks for badge--default/
        success/warning/error/info, which tv still emits) and
        `Badge.a11y.test.tsx` passes; `grep "from 'class-variance-authority'"
        packages/core/src/components/atoms/Badge/Badge.tsx` → 0 matches;
        `grep "tv(" packages/core/src/components/atoms/Badge/Badge.tsx` → match.

- [ ] 6. Migrate Button: tv for visual classes, keep
      `createButtonBehavior` for ARIA/handlers; derive ButtonProps from tv.
      - What: In `packages/core/src/components/atoms/Button/Button.tsx`:
        - Change `import { cn } from '../../../utils/cn';` to
          `import { cn, tv, type VariantProps } from
          '../../../utils/cn';` (cn now re-exports tv/VariantProps).
        - Keep `import { createButtonBehavior } from
          '@ui-construction-library/behaviors';` and the React imports
          (`ButtonHTMLAttributes`, `ComponentPropsWithoutRef`, `ElementType`,
          `forwardRef`, `ReactNode`) unchanged.
        - Keep `import type { ButtonBehaviorOptions } from
          '../../../types/component-types';` but **remove** `ButtonSize` and
          `ButtonVariant` from that import (ButtonProps will derive them from
          tv now).
        - Add the tv config (exact class strings from the brief; note
          `ucl-button--md` is a CSS no-op so adding it for the default is
          safe, and `ucl-button--destructive-icon` has no CSS yet — it is the
          compoundVariants entry the brief requires):
          ```ts
          const buttonVariants = tv({
            base: 'ucl-button',
            variants: {
              variant: {
                default: 'ucl-button--default',
                secondary: 'ucl-button--secondary',
                destructive: 'ucl-button--destructive',
                ghost: 'ucl-button--ghost',
                outline: 'ucl-button--outline',
                link: 'ucl-button--link',
                success: 'ucl-button--success',
                warning: 'ucl-button--warning',
                info: 'ucl-button--info',
              },
              size: {
                sm: 'ucl-button--sm',
                md: 'ucl-button--md',
                lg: 'ucl-button--lg',
                icon: 'ucl-button--icon',
              },
            },
            defaultVariants: {
              variant: 'default',
              size: 'md',
            },
            compoundVariants: [
              {
                variant: 'destructive',
                size: 'icon',
                class: 'ucl-button--destructive-icon',
              },
            ],
          });
          ```
        - Change `ButtonProps` to derive variant/size from tv and drop the
          explicit `variant?`/`size?` fields:
          ```ts
          export interface ButtonProps
            extends ButtonHTMLAttributes<HTMLButtonElement>,
              VariantProps<typeof buttonVariants> {
            as?: ElementType;
            href?: string;
            target?: string;
            rel?: string;
            loading?: boolean;
            leftIcon?: ReactNode;
            rightIcon?: ReactNode;
          }
          ```
          (VariantProps adds `variant?`, `size?`, and an optional `className`
          already covered by ButtonHTMLAttributes — compatible, no duplicate
          error.)
        - In the render, keep the `createButtonBehavior` call for a11y but
          stop destructuring its className:
          `const { attrs, handlers } = createButtonBehavior({ variant, size,
          loading, disabled, onClick } satisfies ButtonBehaviorOptions);`
          and change the className to the tv resolver (mirroring Badge's
          `cn(badgeVariants({ ... }))` pattern):
          `className={cn(buttonVariants({ variant, size, className }))}`.
          Keep `{...attrs}` (role, aria-disabled, aria-busy, data-variant,
          data-size) and `{...handlers}` (onClick + onKeyDown) spread on the
          Component — the keyboard-activation a11y test depends on
          `handlers.onKeyDown`. Keep the loading spinner + icon children
          markup unchanged.
        - Add `buttonVariants` to the exports: `export { Button,
          buttonVariants };` (component-types.ts needs it as a type import).
      - Files: `packages/core/src/components/atoms/Button/Button.tsx`
      - Verify: `pnpm --filter @ui-construction-library/core typecheck` passes
        (no unused `ButtonVariant`/`ButtonSize` import; ButtonProps derives
        from tv); `pnpm --filter @ui-construction-library/core test` —
        `Button.test.tsx` (renders/click) and `Button.a11y.test.tsx`
        (aria-label + Enter-key keyboard activation via handlers) pass;
        `grep "tv(" packages/core/src/components/atoms/Button/Button.tsx` →
        match.

- [ ] 7. Migrate Card from inline cn to tv (elevation + interactive `true`).
      - What: In `packages/core/src/components/molecules/Card/Card.tsx`:
        - Change `import { cn } from '../../../utils/cn';` to
          `import { cn, tv } from '../../../utils/cn';` (or
          `from '../../../utils/variants'` — both re-export tv; use cn for
          consistency).
        - Add the tv config per the brief (elevation values become flat/raised/
          glass; default flat; interactive uses the `true` boolean key):
          ```ts
          const cardVariants = tv({
            base: 'card',
            variants: {
              elevation: {
                flat: 'card--flat',
                raised: 'card--raised',
                glass: 'card--glass',
              },
              interactive: {
                true: 'card--interactive',
              },
            },
            defaultVariants: {
              elevation: 'flat',
            },
          });
          ```
        - Update `CardProps` so `elevation` matches the new tv keys:
          `elevation?: 'flat' | 'raised' | 'glass';` (was `'flat' | 'raised' |
          'overlay'`; no consumer passes `elevation`, so this is safe). Keep
          `interactive?: boolean`.
        - In the render, replace the inline `cn('card', \`card--${elevation}\`,
          interactive && 'card--interactive', className)` with
          `className={cn(cardVariants({ elevation, interactive, className }))}`
          and change the destructure default from `elevation = 'raised'` to
          `elevation = 'flat'` (matches tv's `defaultVariants.elevation`, so
          `data-elevation={elevation}` stays `'flat'` for unset cards instead
          of becoming `undefined`). Keep the `data-elevation={elevation}` and
          `data-interactive={interactive || undefined}` attributes and the
          rest of the render unchanged. (No CSS keys off `data-elevation`, so
          this is a no-op visually; it just keeps the attribute meaningful.)
      - Files: `packages/core/src/components/molecules/Card/Card.tsx`
      - Verify: `pnpm --filter @ui-construction-library/core typecheck` passes;
        `pnpm --filter @ui-construction-library/core test` — `Card.test.tsx`
        (renders + axe) passes; `grep "tv("
        packages/core/src/components/molecules/Card/Card.tsx` → match.

- [ ] 8. Derive ButtonVariant/ButtonSize/BadgeVariant in component-types.ts
      from the tv configs; keep all other types unchanged.
      - What: In `packages/core/src/types/component-types.ts`:
        - Keep the existing `import type { VariantProps } from
          'class-variance-authority';` (still used by TextSize, TextWeight,
          TextAreaVariant, TextAreaSize, ModalSize, PopoverSize, DropdownSize).
        - Add `import type { VariantProps as TvVariantProps } from
          'tailwind-variants';` (aliased to avoid the name clash).
        - Add `import type { buttonVariants } from
          '../components/atoms/Button/Button';` and `import type {
          badgeVariants } from '../components/atoms/Badge/Badge';` (type-only,
          so no runtime circular import even though Button.tsx imports
          `ButtonBehaviorOptions` back from this file).
        - Replace the manual unions:
          `export type ButtonVariant = 'default' | 'secondary' | ...` →
          `export type ButtonVariant = TvVariantProps<typeof
          buttonVariants>['variant'];`
          `export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';` →
          `export type ButtonSize = TvVariantProps<typeof buttonVariants>
          ['size'];`
          and `export type BadgeVariant = VariantProps<typeof badgeVariants>
          ['variant'];` (CVA) → `export type BadgeVariant = TvVariantProps<
          typeof badgeVariants>['variant'];` (tv), since badgeVariants is now
          a tv config.
        - Keep `ComponentSize` as the re-export from step 4 (do not
          re-define), and keep `ButtonBehaviorOptions`, `InputSize`,
          `SelectSize`, `TextSize`, `TextWeight`, `TextAreaVariant`,
          `TextAreaSize`, `ModalSize`, `PopoverSize`, `DropdownSize`
          unchanged. `ButtonBehaviorOptions` references ButtonVariant/
          ButtonSize — now tv-derived — which is fine.
      - Files: `packages/core/src/types/component-types.ts`
      - Verify: `pnpm --filter @ui-construction-library/core typecheck` passes
        with 0 errors (the alias + type-only imports resolve); the public
        re-export in `packages/core/src/components/index.ts` of
        BadgeVariant/ButtonSize/ButtonVariant/ComponentSize still compiles.

- [ ] 9. Full verification gate (run in order from the repo root; fix any
      errors before committing).
      - What: Run the project's real commands. Format if Biome reports
        formatting issues (`pnpm format`), then re-lint.
      - Commands and expected results:
        1. `pnpm install` → exits 0, tailwind-variants linked, lockfile
           updated.
        2. `pnpm --filter @ui-construction-library/core typecheck` → 0 errors
           (runs `tsc --noEmit` in core).
        3. `pnpm lint` (== `biome check .`) → 0 errors; warnings OK. If it
           reports formatting errors, run `pnpm format` then `pnpm lint`
           again until 0 errors. (Note: a pre-existing uncommitted `biome.json`
           change exists in the tree; do not touch it — it is unrelated to
           Ф4 and must not be staged.)
        4. `pnpm --filter @ui-construction-library/core test` (== `vitest run
           --config ./vitest.config.ts src`) → Badge/Button/Card tests pass
           and nothing regresses.
        5. `grep "from 'class-variance-authority'"
           packages/core/src/components/atoms/Badge/Badge.tsx` → 0 matches.
        6. `grep "tv("
           packages/core/src/components/atoms/Badge/Badge.tsx` → match.
        7. `grep "tv("
           packages/core/src/components/atoms/Button/Button.tsx` → match.
        8. `grep "tv("
           packages/core/src/components/molecules/Card/Card.tsx` → match.
      - Verify: all eight pass. Do NOT run `pnpm build` (slow Rollup) —
        typecheck + test only, per the brief.

- [ ] 10. Commit the Ф4 changes with the exact brief message.
      - What: Stage ONLY the explicit Ф4 files — do NOT use `git add -A` or
        `git add .` (the working tree has a pre-existing modified `biome.json`
        and untracked `.agents/`/`.kiro/` that must stay out of this commit;
        neither `.agents` nor `.kiro` is gitignored). From the repo root:
        ```
        git -C /Users/jilimbo/Documents/Personal/core-infra/UI-Library add \
          pnpm-workspace.yaml \
          pnpm-lock.yaml \
          packages/core/package.json \
          packages/core/src/utils/variants.ts \
          packages/core/src/utils/cn.ts \
          packages/core/src/types/component-props.ts \
          packages/core/src/types/component-types.ts \
          packages/core/src/components/atoms/Badge/Badge.tsx \
          packages/core/src/components/atoms/Button/Button.tsx \
          packages/core/src/components/molecules/Card/Card.tsx
        ```
        Then confirm `git status --short` shows ONLY those files staged and
        `biome.json`/`.agents/`/`.kiro/` NOT staged. Then commit with the
        exact message (single line):
        ```
        feat(core): Ф4 — unified variant engine (tailwind-variants), migrate Badge/Button/Card as representatives
        ```
        Do NOT push.
      - Files: (staging only — see list above)
      - Verify: `git -C /Users/jilimbo/Documents/Personal/core-infra/UI-Library
        show --stat --oneline HEAD` lists exactly the 10 staged files (no
        `biome.json`, no `.agents/`, no `.kiro/`); `git -C ... log -1 --pretty=
        %s` prints the exact message above; `git -C ... status --short` shows
        `biome.json`, `.agents/`, `.kiro/` still untracked/modified and NOT in
        the commit.

---

## Dependency / ordering notes

- Steps 1 → 2 → 3 (variants.ts before cn.ts re-exports it; install before
  anything imports tailwind-variants).
- Step 4 (component-props.ts + ComponentSize re-export) is independent of the
  component migrations; can be done right after step 3.
- Steps 5, 6, 7 (Badge/Button/Card) depend on steps 2-3 (tv available). They
  are independent of each other but step 8 depends on all three (it imports
  `buttonVariants` and `badgeVariants`, which must exist and be exported).
- Step 6 exports `buttonVariants`; step 5 already exports `badgeVariants`;
  step 8 imports both as types.
- Step 9 runs the full gate after 1-8.
- Step 10 commits after 9 is green.

## What NOT to do

- Do NOT run `pnpm build` (slow Rollup).
- Do NOT remove `class-variance-authority` from any package.json (other
  components still import it directly).
- Do NOT change any CSS class strings (`ucl-button`, `badge--success`, `card`,
  etc.) — only the JS engine changes.
- Do NOT touch the behaviors package; `createButtonBehavior` stays as-is and
  the Button keeps using it for attrs/handlers.
- Do NOT stage `biome.json`, `.agents/`, or `.kiro/` in the Ф4 commit.
