# Roadmap

*Last updated: June 2026*

This is the public product roadmap for `@ui-construction-library`. It reflects current priorities and is subject to change based on community feedback and maintainer capacity.

## Legend

- 🟢 **Shipping now** — actively being worked on
- 🟡 **Next up** — queued and scoped
- ⚪ **Future** — explored but not yet scheduled

---

## Phase: Production Maturity

_Goal: Promote to 1.0.0 stable_

| Item | Status | Notes |
|------|--------|-------|
| Cross-browser E2E testing | 🟢 | Firefox + Safari added to CI |
| Browser compatibility matrix | 🟢 | Documented in support-policy.md |
| Bundle size monitoring | 🟢 | Automated in CI |
| v1.0.0 release | 🟡 | Checklist in progress |
| npm provenance (OIDC) | 🟢 | Already enabled |

## Phase: New Components & Templates

_Goal: Cover 90% of common UI patterns_

| Item | Status | Notes |
|------|--------|-------|
| Date picker component | 🟢 | Shipped with WAI-ARIA grid calendar |
| File upload / dropzone | 🟢 | Shipped with drag-and-drop & size limit |
| Sidebar navigation template | 🟢 | Shipped (`SidebarLayout`) |
| Settings page template | ⚪ | In backlog |
| Auth flow template (login/signup) | 🟢 | Shipped (`AuthShell`, `AuthLayout`) |
| CRUD list page template | ⚪ | In backlog |

## Phase: Developer Experience

_Goal: Make the library instantly usable_

| Item | Status | Notes |
|------|--------|-------|
| Per-package npm READMEs | 🟢 | Complete for all packages |
| CodeSandbox / StackBlitz templates | 🟢 | Links in README |
| Starter scaffolding CLI (`create-ucl-app`) | ⚪ | Not yet started |
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

- A+ quality certification (May 2026)
- Multi-framework dashboards (Vue, Solid, Svelte)
- 299 icon components
- Design token pipeline with Tailwind preset
- Cross-browser E2E test suite
- SBOM generation for supply chain security

---

_See [docs/roadmaps/README.md](./docs/roadmaps/README.md) for the internal engineering roadmap and [docs/quality/a-plus-improvement-roadmap.md](./docs/quality/a-plus-improvement-roadmap.md) for the A+ quality program._
