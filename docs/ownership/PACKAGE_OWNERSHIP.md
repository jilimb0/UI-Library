# Package & Subsystem Ownership

Ownership means **review authority, incident response, and roadmap accountability** — not exclusive commit access.

| Area | Package / path | Primary owner | Backup | Notes |
| --- | --- | --- | --- | --- |
| Platform / CI | `.github/workflows`, `scripts/check-dependency-boundaries.sh`, root `package.json` | platform | core | Release gates, `check:deps` |
| Foundation | `@ui-construction-library/tokens` | tokens | core | Scales, semantic colors, CSS vars |
| Icons | `@ui-construction-library/icons` | icons | core | Lucide today → SVG program Phase 1 |
| Components | `@ui-construction-library/core` | core | — | Atoms → templates |
| Utils (calendar) | `packages/utils/src/date/*` | utils | platform | Replaces `date-fns` in core |
| Utils | `@ui-construction-library/utils` | core | — | Shared non-UI helpers |
| Primitives (planned) | `@ui-construction-library/primitives` | core | a11y | Phase 2 — not yet extracted |
| Motion (planned) | `@ui-construction-library/motion` | core | — | Phase 1 |
| DnD (planned) | `@ui-construction-library/dnd` | core | — | Phase 2 |
| A11y contracts (planned) | `packages/a11y` or `core` test suite | a11y | core | Phase 2+ |
| Integrations | `packages/integrations/*` | integrations | core | Must not block core releases |
| RHF plugin | `@ui-construction-library/react-hook-form` | integrations | core | Optional |
| Apps | `apps/docs`, `apps/storybook`, `apps/demo-showcase`, `apps/playground` | apps | core | Consumption surfaces |
| Docs | `docs/**`, `apps/docs` | docs | core | Product + API docs |
| Release | `docs/release/*`, Changesets | release | platform | Runbooks, channels |
| E2E | `tests/e2e` | qa | core | Smoke + a11y paths |

## Subsystem RACI (v1.0 gates)

| Subsystem | Responsible | Accountable | Consulted | Informed |
| --- | --- | --- | --- | --- |
| Dependency / supply chain | platform | platform | core | all |
| Primitives & a11y | core | core | a11y | integrations |
| Visual regression | apps (storybook) | core | design | release |
| Performance budgets | core | platform | — | release |
| Certification sign-off | release | platform | core, qa | all |

## Escalation

1. **Breaking a11y or boundary check on `main`** — core owner, fix or revert within one business day.
2. **Critical CVE in Tier 0–1 dep** — platform opens patch PR; core validates component behavior.
3. **Integration breaking core API** — integrations must not merge until core changeset is published or coordinated.

Update this table when teams or named maintainers change.
