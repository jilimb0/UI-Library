# Dependency Inventory

Living register of **direct runtime and platform dependencies** with owner, criticality tier, and exit strategy. Update this file when adding/removing/replacing dependencies or completing a replacement phase.

**Last reviewed:** Phase 0 baseline (adapter boundary + CI `check:deps`).

## Legend

| Status | Meaning |
| --- | --- |
| `wrapped` | Only imported via `packages/core/src/adapters/*` or dedicated package boundary |
| `internal` | First-party (`@ui-construction-library/*`) |
| `planned-replace` | Scheduled for in-repo implementation per platform program |
| `keep` | Retain long-term (utility or acceptable cost) |
| `fork` | Vendor copy under `packages/internal-forks/*` (not yet used) |
| `violation` | Known breach of policy — must have dated remediation |

## Tier 0 — Platform-critical

| Package | Where | Owner | Status | Exit strategy |
| --- | --- | --- | --- | --- |
| `react`, `react-dom` | peers / catalog | `@ui-construction-library/core` | keep | Stay on React 18 LTS; upgrade via catalog + full CI |
| `typescript` | workspace | platform | keep | Pin via catalog; major upgrades gated on types + build |
| `vite`, `rollup` | apps / packages | platform | keep | Toolchain only; not shipped in library runtime |
| `vitest`, `@testing-library/*` | core dev | platform | keep | Test-only |
| `pnpm`, `turbo` | root | platform | keep | Reproducible install documented in CONTRIBUTING |

## Tier 1 — UI runtime-critical (replaced in owned packages)

| Former package | Owned replacement | Status |
| --- | --- | --- |
| `@radix-ui/*` (7) | `@ui-construction-library/primitives` | **internal** |
| `@dnd-kit/*` | `@ui-construction-library/dnd` | **internal** |
| `framer-motion` | `@ui-construction-library/motion` | **internal** |
| `lucide-react` | `@ui-construction-library/icons` (SVG) | **internal** |

`@ui-construction-library/core` has **zero** Tier-1 UI runtime dependencies.

## Tier 1 — remaining in `core` (evaluated)

| Package | Used by | Owner | Status | Exit strategy |
| --- | --- | --- | --- | --- |
| `date-fns` | Calendar, DatePicker | core | keep | Utility; low lock-in |
| `cmdk` | CommandPalette | core | keep | Optional fork later |

**Adapter entry points (thin re-exports):** `packages/core/src/adapters/{radix,dnd,motion,icons}.ts` → owned packages

## Tier 2 — Utility / support (`core`)

| Package | Used by | Owner | Status | Exit strategy |
| --- | --- | --- | --- | --- |
| `clsx` | `cn` helper | core | keep | Trivial; optional inline later |
| `tailwind-merge` | `cn` helper | core | keep | Trivial; optional inline later |
| `class-variance-authority` | variant APIs | core | keep or fork | Low risk; fork only if supply-chain policy requires |
| `zod` | validation utils | core | keep | Schema validation; fork unlikely |

## First-party packages

| Package | Role | Owner | Tier-1 deps |
| --- | --- | --- | --- |
| `@ui-construction-library/tokens` | foundation | tokens | none |
| `@ui-construction-library/icons` | owned SVG icon set | icons | none |
| `@ui-construction-library/primitives` | headless primitives | primitives | none |
| `@ui-construction-library/motion` | motion layer | motion | none |
| `@ui-construction-library/dnd` | pointer DnD | dnd | none |
| `@ui-construction-library/core` | components | core | see Tier 1/2 |
| `@ui-construction-library/utils` | shared utils | core | none |
| `@ui-construction-library/integration-*` | optional plugins | integrations | none (depend on core only) |
| `@ui-construction-library/react-hook-form` | form plugin | integrations | none |

## App workspaces

| App | UI imports | Extra runtime deps | Notes |
| --- | --- | --- | --- |
| `apps/docs` | `@ui-construction-library/core`, `tokens` | none | Compliant |
| `apps/storybook` | `core` | none | Compliant |
| `apps/demo-showcase` | `core`, `icons`, `react-hook-form` | `react-hook-form` (demo only) | OK — not a UI primitive |
| `apps/playground` | `core`, `icons`, `utils` | none | Compliant (enforced via `check-app-dependency-policy.sh`) |

## Integrations (optional boundary)

| Package | External peer | Blocks core? |
| --- | --- | --- |
| `integration-next` | `next` | No |
| `integration-tanstack-query` | `@tanstack/react-query` | No |
| `integration-tanstack-router` | `@tanstack/react-router` | No |
| `integration-i18n` | `i18next`, `react-i18next` | No |
| `react-hook-form` | `react-hook-form` | No |

## CI enforcement map

| Check | Enforces | Phase |
| --- | --- | --- |
| `pnpm check:deps` | No Tier-1 import strings outside adapters; no forbidden UI deps in `apps/*/package.json` | 0 ✅ |
| `pnpm validate` | Full local gate bundle | 0 ✅ |
| E2E / a11y / visual / perf / security | See [self-owned platform](./self-owned-platform.md) | 1–3 |

## Adding a dependency

1. Pick tier in [dependency policy](./dependency-policy.md).
2. Add a row to this inventory (owner + exit strategy).
3. If Tier 1: add adapter module first; never import from components directly.
4. Run `pnpm check:deps` and full `pnpm validate`.

## Quarterly audit checklist

- [ ] Reconcile this table with `packages/core/package.json` and `pnpm why <pkg>`
- [ ] Scan `apps/*` `package.json` for forbidden runtime deps
- [ ] Confirm adapter-only imports (`rg` + `check:deps`)
- [ ] Review CVEs for Tier 0–1 packages
- [ ] Update metrics in [self-owned platform](./self-owned-platform.md)
