# Self-Owned Platform Program

Long-running platform initiative to move UI Construction Library from **controlled independence** to **v1.0 self-owned** — full ownership of runtime behavior, supply chain, releases, and operations without mandatory third-party UI primitives.

## Maturity levels

| Level | Name | Summary |
| --- | --- | --- |
| L0 | Vendor-dependent | Apps and `core` import external UI libraries directly. |
| L1 | Controlled independence | Tier-1 UI deps only via adapters; CI blocks stray imports. |
| L2 | Self-owned core | `@ui-construction-library/primitives`, `motion`, `dnd`, `icons` — no Tier-1 in `core`. |
| L3 | v1.0 self-owned | **Current baseline.** L2 + all quality gates green; see [certification](../release/v1-self-owned-certification.md). |

**Program target:** L3 (`v1.0 self-owned`).  
**Pragmatic alternative** if time-to-market dominates: stay at L1 with a frozen Tier-1 set and strict adapter policy.

## Definition of Done (v1.0 self-owned)

### Runtime & architecture

1. `@ui-construction-library/core` (and future `@ui-construction-library/primitives`, `motion`, `dnd`) ship **no required** Tier-1 UI runtime dependencies (`@radix-ui/*`, `@dnd-kit/*`, `framer-motion`, `lucide-react` as runtime).
2. Dialog, Tabs, Popover, Switch, Slider, Accordion, ContextMenu, Kanban DnD, and motion utilities are **implemented and maintained in-repo** (or via audited internal forks under `packages/internal-forks/*`).
3. App workspaces (`apps/*`) import UI only from `@ui-construction-library/*` (see [dependency policy](./dependency-policy.md)).
4. Integrations (`packages/integrations/*`, `react-hook-form`) do not affect core readiness or semver of `core`.

### Quality gates (all mandatory on `main`)

| Gate | Tool / location | v1.0 requirement |
| --- | --- | --- |
| Dependency boundaries | `pnpm check:deps` | 0 violations |
| Lint / format | Biome | Green |
| Types | `pnpm typecheck` | Green |
| Unit / component tests | Vitest | Green, coverage thresholds TBD per package |
| E2E smoke | Playwright under `tests/e2e` | Green on PR |
| A11y contract | jest-axe + Storybook a11y addon | Green for primitives + changed organisms |
| Visual regression | Chromatic / Storybook snapshots | Green for changed stories |
| Bundle budgets | Per-package size limits in CI | No regressions beyond budget |
| Security | `pnpm audit` + license policy | No critical vulns; license allow-list |
| API semver | Changesets + API snapshot tests | No unintended breaking changes |

### Operations

5. **Reproducible build:** `pnpm install --frozen-lockfile` + documented Node/pnpm versions (`.nvmrc`, `packageManager`).
6. **Rollback playbook:** documented in [RELEASE_RUNBOOK](../release/RELEASE_RUNBOOK.md); canary → stable promotion with revert steps.
7. **Ownership:** every published package and subsystem has a named owner (see [package ownership](../ownership/PACKAGE_OWNERSHIP.md)).

### Documentation

8. Architecture spec, ADRs, dependency inventory with exit strategies, and migration guides are current with each major phase.

## Metrics (tracked per phase)

| Metric | L1 (now) | L2 target | L3 target |
| --- | --- | --- | --- |
| Direct Tier-1 UI imports in `core` | **0** (enforced) | 0 | 0 |
| Tier-1 packages in `core` `dependencies` | **0** | 0 | 0 |
| Primitives with in-repo headless impl | **7/7** | 7/7 | 7/7 + a11y suite |
| `apps/*` forbidden runtime deps in `package.json` | **0** (enforced) | 0 | 0 |
| Adapter modules (thin re-exports) | 4 → owned packages | optional remove | — |
| CI gates on PR | deps, lint, type, test, build | + e2e, a11y, visual | + perf, security, API |
| Integration packages blocking core release | No | No | No |

Update counts in [dependency inventory](./dependency-inventory.md) when dependencies change.

## Permanent exceptions (not counted against “self-owned”)

These are **accepted platform dependencies**, not UI primitives to replace:

- **React runtime:** `react`, `react-dom` (peer)
- **Toolchain:** `typescript`, `vite`, `rollup`, `vitest`, `pnpm`, `turbo`, `biome`
- **Styling ecosystem:** `tailwindcss` in apps/dev (not shipped as mandatory runtime in `core`)
- **Optional integration boundaries:** `@tanstack/*`, `next`, `react-hook-form`, `i18next` — only via `packages/integrations/*`

## Layer model (target)

```
ops          → CI/CD, security, release, reproducibility
integrations → optional plugins (Next, TanStack, RHF, i18n)
components   → atoms / molecules / organisms / templates  (@ui-construction-library/core)
primitives   → headless a11y-first building blocks         (future: @ui-construction-library/primitives)
foundation   → tokens, theming, motion tokens              (@ui-construction-library/tokens)
```

**Import contract:** application code → `@ui-construction-library/*` only for UI. External packages enter through adapters (L1) or internal implementations (L2+).

## Phased roadmap (aligned with program tasks)

| Phase | Duration | Focus | Exit criteria |
| --- | --- | --- | --- |
| **0** | 1–2 weeks | DoD, inventory, gates | This doc + inventory + ADR-0001 + `check:deps` in CI |
| **1** | 3–6 weeks | Icons, motion, adapter hardening | Icon generator path; motion wrappers internalized; 0 adapter leaks |
| **2** | 6–10 weeks | Radix + DnD replacement | Internal primitives; expanded a11y tests |
| **3** | 3–5 weeks | Perf, security, release | Budgets, audit gates, canary/stable channels |
| **4** | 1–2 weeks | Certification | `docs/release/v1-self-owned-certification.md` signed off |

## Risks (program-level)

- **A11y regression** when replacing Radix — mitigate with a11y contract suite before swapping default implementations.
- **Velocity dip** during Phase 2 — feature freeze window or parallel “stabilization” branch.
- **Maintenance cost** of custom primitives — budget ownership and quarterly primitive reviews.
- **Test infra debt** — visual and perf gates must land before L3 sign-off, not after.

## Related documents

- [Dependency policy](./dependency-policy.md)
- [Dependency inventory](./dependency-inventory.md)
- [Architecture](./architecture.md)
- [ADR-0001: Adapter boundary](../adr/0001-adapter-boundary-for-external-ui.md)
- [Package ownership](../ownership/PACKAGE_OWNERSHIP.md)
- [Roadmap progress](./roadmap-progress.md)
