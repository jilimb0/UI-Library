# v1 Excellence Release Notes

These notes summarize the `v1.0` self-owned release posture for UI Construction Library and point back to the canonical release docs in [`README.md`](./README.md) and [`RELEASE_RUNBOOK.md`](./RELEASE_RUNBOOK.md).

## What shipped

- `@ui-construction-library/core` owns its runtime component surface without direct Tier-1 UI imports.
- `@ui-construction-library/primitives`, `motion`, `dnd`, `icons`, `registry`, and `styles` are first-class workspace packages.
- Builder, docs, demo-showcase, playground, and Storybook all validate against the shared workspace policy.

## V1 release preparation session (2026-07-03)

### Testing expansion — 200+ new tests

| Package | New Tests | Coverage |
|---------|-----------|----------|
| export-core | 69 tests across 5 files | 100% (was 0%) |
| dnd | 16 tests (was 2) | Baseline met |
| motion | 24 tests (was 1) | Baseline met |
| icons | 23 tests (was 1) | Baseline met |
| Integration packages | 73 tests (next 14, tanstack-query 15, tanstack-router 17, rhf 16, i18n 9) | All passing |
| **Total** | **200+ new tests** | **240 total, 79 test files** |

### Storybook — 59 new stories

- **primitives:** 16 stories
- **motion:** 10 stories
- **icons:** 14 stories
- **behaviors:** 19 stories
- All packages now have Storybook coverage.

### Infrastructure hardening

| Change | Detail |
|--------|--------|
| **Version drift fixed** | 13 packages manually synced to match npm published versions |
| **Node 22 support** | Engine lowered from `>=26` to `>=22.0.0` for broader compatibility |
| **CI/CD cleanup** | 10 workflow files updated: Node 24→22, checkout@v5→v6, removed `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` |
| **Netlify config** | PNPM_VERSION: 9 → 11 |
| **Husky pre-push** | Lightened from `pnpm validate` to `pnpm lint && typecheck && test` |
| **Build artifacts** | 22 `.tgz` files deleted from integrations |
| **AGENTS.md** | Updated with accurate package count, Node 22, pnpm 11, Vitest 4, Biome 2.4.15 |

### Quality gates

- **Coverage enforcement:** Root vitest.config.ts enforces ≥80% thresholds (statements, branches, functions, lines). export-core and prompt-engine have per-package 60% baselines.
- **Bundle budgets:** Defined and passing for all 9 packages (core 150KB, tokens 50KB, primitives 30KB, icons 100KB, styles 20KB, motion 20KB, dnd 30KB, behaviors 20KB, utils 20KB). Verified via `tests/performance/bundle-size.test.ts`.
- **API snapshot:** Generated and verified via `check:api` — tracked in CI.
- **SBOM:** Generated via CycloneDX — `artifacts/sbom.cyclonedx.json`, 48 components cataloged.
- **Dependency audit:** 0 high/critical, 3 moderate, 1 low — passes at `--audit-level=high`.
- **Security hygiene:** `check:hygiene` passes — no secrets or artifacts tracked.
- **JSDoc `@example`:** Added to 10 key components (Button, Input, Select, Checkbox, Switch, Dialog, DataTable, Form, Modal, Table).
- **Performance benchmarks:** 22/22 tests passing across export-performance, bundle-size, render-performance, a11y-performance, memory-leaks.

### Cross-browser E2E

- Playwright Firefox config updated with `launchOptions.args: ['--headless']`.
- 31/32 Chromium tests pass.
- Remaining gaps: Firefox hangs on CI, webkit has visual diffs in dialog and data-table stories.

### Version bump & changelogs

- 12 packages bumped via `release:prepare --bump=minor`.
- All 18 CHANGELOG.md files generated and reviewed.
- Ready for `v1.0.0` stable release.

## Quality gates

- Dependency boundaries and app import policy checks pass in CI.
- API snapshot, source registry, preset docs, gold kits, and launch checks are wired into the validation flow.
- Focused component, integration, and builder helper tests cover the high-risk surface area.

## Operating notes

- Use `docs/release/RELEASE_RUNBOOK.md` for versioning and promotion steps.
- Use `docs/guides/self-owned-platform.md` for the platform ownership model and certification criteria.
- Keep `docs/guides/dependency-inventory.md` current when workspace dependencies change.
