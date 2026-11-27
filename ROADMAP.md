# Roadmap

*Last updated: November 2026*

This is the public product roadmap for `@ui-construction-library`. It reflects current priorities and is subject to change based on community feedback and maintainer capacity.

## Legend

- 🟢 **Complete / Shipping now** — shipped or actively maintained
- 🟡 **In progress / Next up** — actively resolving remaining items
- ⚪ **Future** — explored but not yet scheduled

---

## Phase: Production Maturity

_Goal: Promote to 1.0.0 stable_

| Item | Status | Notes |
|------|--------|-------|
| Cross-browser E2E testing | 🟡 | In progress — Firefox CI hang & WebKit dialog/data-table diff |
| Browser compatibility matrix | 🟢 | Documented in support-policy.md |
| Bundle size monitoring | 🟢 | Automated in CI |
| v1.0.0 release | 🟡 | Checklist in progress (19 of 24 pre-release items complete; core at `0.10.1`) |
| npm provenance (OIDC) | 🟢 | Already enabled |

## Phase: New Components & Templates

_Goal: Cover 90% of common UI patterns_

| Item | Status | Notes |
|------|--------|-------|
| Date picker component | 🟢 | Complete — Shipped with WAI-ARIA grid calendar |
| File upload / dropzone | 🟢 | Complete — Shipped with drag-and-drop & size limit |
| Sidebar navigation template | 🟢 | Complete — Shipped (`SidebarLayout`) |
| Settings flow (`settings-app` / `SettingsAppDemo`) | 🟢 | Complete — Form-driven settings flow in `prompt-engine` & `demo-showcase` |
| Auth flow template (login/signup) | 🟢 | Complete — Shipped (`AuthShell`, `AuthLayout`) |
| Agent Control Room template (`ADR-0003`) | 🟢 | Complete — `AgentControlRoom` + `SourceLineageDrawer` + `packages/schema` Zod contracts |
| Terminal UI Kit (`ADR-0004`) | 🟢 | Complete — `WidgetLinkBus`, `CommandPalette` `[Subject] [Mnemonic] <GO>` & ratio grammar, `TilingWorkspace`, `SynchronizedChartGrid` |
| Architecture Floorplan template (`ADR-0005`) | 🟢 | Complete — `ArchitectureFloorplan` multi-zoom `gavel/floorplan@1` viewer & Zod 4 schema contract |
| CRUD list page template | ⚪ | In backlog |

## Phase: Developer Experience

_Goal: Make the library instantly usable_

| Item | Status | Notes |
|------|--------|-------|
| Per-package npm READMEs | 🟢 | Complete across all 20 workspace packages |
| CodeSandbox / StackBlitz templates | 🟢 | Links in README |
| Starter scaffolding CLI (`create-ucl-app` / `@ui-construction-library/cli`) | 🟢 | Complete — `init` & `tokens` scaffolding commands |
| Video walkthrough | ⚪ | |
| Interactive playground | 🟡 | Needs improvements |

## Phase: Integration Ecosystem

_Goal: First-class support for popular stacks_

| Item | Status | Notes |
|------|--------|-------|
| Next.js App Router | 🟢 | Shipped |
| react-hook-form | 🟢 | Shipped |
| TanStack Query | 🟢 | Shipped |
| TanStack Router | 🟢 | Shipped |
| i18n / i18next | 🟢 | Shipped |
| Remix / React Router | ⚪ | |
| Astro | ⚪ | |

## Phase: Framework-agnostic Expansion

_Goal: Parity across React, Vue, Solid, Svelte_

| Item | Status | Notes |
|------|--------|-------|
| Dashboard apps for Vue/Solid/Svelte | 🟢 | Proof-of-concept shipped |
| Full component parity (Vue) | ⚪ | |
| Full component parity (Solid) | ⚪ | |
| Full component parity (Svelte) | ⚪ | |

## Recently shipped

- **ArchitectureFloorplan (`ADR-0005`, Nov 2026):** Multi-zoom `gavel/floorplan@1` topology viewer on `--ucl-*` tokens, SSR-guarded IndexedDB zoom persistence, integer `bps`/`BigInt` metrics, and Zod 4 schema contract
- **Terminal UI Kit (`ADR-0004`, Nov 2026):** `WidgetLinkBus` (`?g_<color>` + guarded `BroadcastChannel`), `[Subject] [Mnemonic] <GO>` & spread ratio parser in `CommandPalette`, 6-panel `TilingWorkspace` (`Alt+1..6`), and pure-SVG `BigInt`-projected `SynchronizedChartGrid`
- **AgentControlRoom (`ADR-0003`):** Multi-agent trace waterfall, CAS approval gates, `SourceLineageDrawer`, and `0.10.1` core release
- A+ quality certification (May 2026)
- Multi-framework dashboards (Vue, Solid, Svelte)
- 299 icon components
- Design token pipeline with Tailwind preset
- SBOM generation for supply chain security

---

_See [docs/roadmaps/README.md](./docs/roadmaps/README.md) for the internal engineering roadmap and [docs/quality/a-plus-improvement-roadmap.md](./docs/quality/a-plus-improvement-roadmap.md) for the A+ quality program._
