# Roadmap Progress

## Self-Owned Platform (program tracker)

| Phase | Status | Notes |
| --- | --- | --- |
| 0 — DoD, inventory, gates | **Done** | DoD, inventory, ADR-0001, `check:deps`, `check:api`, app policy |
| 1 — Icons, motion, adapters | **Done** | `@ui-construction-library/icons`, `motion`; adapters → owned packages |
| 2 — Radix/DnD primitives | **Done** | `@ui-construction-library/primitives`, `dnd`; Tier-1 removed from `core` |
| 3 — Perf, security, release | **Done** | perf CI, `check:security`, E2E, Chromatic workflow, canary/stable scripts |
| 4 — v1.0 certification | **Done** | [v1-self-owned-certification.md](../release/v1-self-owned-certification.md) |

**Current maturity:** **L3 (v1.0 self-owned)** — all mandatory gates wired; optional named sign-off in certification doc.

## Implemented (feature roadmap)

- Token system refactor (scales, semantic colors, motion, opacity)
- CSS variable generator + ThemeProvider integration
- Tailwind preset in tokens package
- New atoms: Switch, Divider, Tag, Image, Code, Kbd
- New molecules: Pagination, Breadcrumb, Stepper, ComboBox, ContextMenu, Popover, FileUpload, Slider, OTPInput, Rating, ColorPicker, SearchInput
- New organisms: Sidebar, Drawer, CommandPalette, EmptyState, Timeline, TreeView, Calendar, Kanban
- Templates layer: DashboardLayout, SidebarLayout, AuthLayout, DocsLayout, MarketingLayout, StackedLayout
- Compound API for Modal/Tabs/Accordion
- Integrations: next, tanstack-query, tanstack-router, i18n
- Owned platform packages: `icons`, `motion`, `primitives`, `dnd`
- CI: deps, apps, API snapshot, E2E, a11y smoke, Chromatic, performance, security

## Optional follow-ups (post-L3)

- Remove thin `packages/core/src/adapters/*` re-exports (breaking-change window)
- Expand E2E matrix (keyboard paths, more Storybook stories)
- Per-component docs in `docs/api/components.md`
- Stricter bundle budgets per package (beyond current perf workflow)
- Full Chromatic coverage for every story

## Pending finalization (feature)

- Full visual/story coverage for all new components
- Documentation pages per component in `docs/api/components.md`
