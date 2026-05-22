# v1.0 Self-Owned Certification

**Status:** Complete  
**Target maturity:** L3 (v1.0 self-owned)  
**Certified:** 2026-05-22 (automated gate matrix on `main`)

## Checklist

### Runtime autonomy

- [x] Tier-1 UI deps removed from `@ui-construction-library/core`
- [x] `@ui-construction-library/primitives` — Dialog, Tabs, Popover, Switch, Slider, Accordion, ContextMenu
- [x] `@ui-construction-library/motion` — CSS / WAAPI motion layer
- [x] `@ui-construction-library/dnd` — pointer-based DnD for Kanban
- [x] `@ui-construction-library/icons` — owned SVG set (no `lucide-react` runtime)
- [x] `cmdk` / `date-fns` — replaced (owned CommandPalette + utils calendar helpers)
- [x] Adapter re-exports removed — `core` imports `@ui-construction-library/*` directly

### CI gates

| Gate | Workflow / script | Status |
| --- | --- | --- |
| Dependency boundaries | `pnpm check:deps` — [ci.yml](../../.github/workflows/ci.yml) | Green |
| App package policy | `check:deps` (includes `check:apps`) | Green |
| API snapshot | `pnpm check:api` — ci.yml | Green |
| Lint / type / test / build | ci.yml | Green |
| E2E smoke | `pnpm check:e2e` — ci.yml + Pages preview | Green |
| A11y smoke | Playwright + axe — `tests/e2e/accessibility.spec.ts` | Green |
| A11y contract (primitives) | jest-axe in `packages/primitives` | Green |
| Visual regression | [chromatic.yml](../../.github/workflows/chromatic.yml) | Green (requires `CHROMATIC_PROJECT_TOKEN`) |
| Performance / bundle | [performance.yml](../../.github/workflows/performance.yml) | Green |
| Security audit | `pnpm check:security` — ci.yml | Green (high severity) |

Local full platform check: `pnpm validate:platform` (includes E2E; first run builds Storybook).

### Operations

- [x] Frozen lockfile installs
- [x] Changesets release path
- [x] Canary npm dist-tag — `pnpm publish:canary` / [CANARY_RELEASE.md](./CANARY_RELEASE.md)
- [x] Stable promotion — `pnpm publish:stable`
- [x] Rollback runbook (`RELEASE_RUNBOOK.md`)

### Sign-off

Certification is satisfied when all gates above are green on `main`. Named owners may record approval below; absence of names does not block the technical L3 baseline.

| Role | Name | Date |
| --- | --- | --- |
| Core owner | _optional_ | |
| Platform owner | _optional_ | |
| QA | _optional_ | |
