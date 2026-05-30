# Project Status — 30 May 2026

## What Was Done (Codex Session, 30 May)

### ✅ Phase A — Infrastructure Fixes
- `localStorage` shim added to `packages/core/src/test/setup.ts` → ThemeProvider tests stable in happy-dom
- Storybook `main.ts` — glob replaced with resolved absolute path
- Builder `export-core` import was already in worktree before the session

---

### ✅ Phases B / C / D — Coverage

| Layer | Components Added | Tests | Files |
|---|---|---|---|
| Atoms | `Code`, `Divider`, `Progress`, `Switch`, `Tag` | 163 | 60 |
| Molecules | `Breadcrumb`, `ColorPicker`, `ComboBox`, `FileUpload`, `OTPInput` | 173 | 65 |
| Organisms | `CommandPalette`, `Drawer`, `Calendar`, `EmptyState` | 180+ | 69 |

> ⚠️ `Dropdown.keyboard.test.tsx` — pre-existing failing test, left untouched.

---

### ✅ Phase E — Integration Smoke Tests
Smoke tests added for: `next`, `tanstack-query`, `tanstack-router`, `react-hook-form`, `i18n`.  
Root `vitest.config.ts` globs fixed — workspaces are now discovered correctly.

---

### ✅ Phases F / G — Demo + Code Quality
- `flagshipFlows` data module test added to demo-showcase.
- Russian comments translated in `core/src/index.ts`, `components/index.ts`, `utils/validation.ts`, `auth/AuthExample.tsx`.

---

### ✅ Phase H — Publish
Published to npm at `@0.1.0`: `export-core`, `prompt-engine`, `registry`, `schema`, `styles`.  
`pnpm-lock.yaml` updated for published semver ranges; builder restored to `workspace:*`.

---

## Current Repository State

| Metric | Value |
|---|---|
| Changed files | **tracked cleanup and builder refinement remain in progress** |
| Insertions / Deletions | **varies with the current worktree** |
| Branch | `main` |
| Committed / Pushed | ⚠️ **Not committed** |
| `plans/todo.md`, `plans/PLAN.md` | Deleted |

---

## Open Tasks (by priority)

> Source: `docs/planning/cleanup-backlog.md`

### 🔴 Priority 1 — Builder Boundary *(high risk — refactor incrementally)*
- [x] Extract state/domain logic from `App.tsx` into dedicated helpers
- [x] Group persistence/repository code into a data-access layer
- [x] Separate key UI actions from orchestration handlers
- [x] Add boundary document for the builder package

### 🟡 Priority 2 — Documentation Taxonomy
- [x] Merge duplicate `docs/guides/architecture.md` and `docs/architecture/README.md`
- [ ] Consolidate release docs → 4 files (runbook, checklist, template, versioning policy)
- [ ] Add index page for each docs category

### 🟡 Priority 3 — Registry Coverage
- [ ] Tests for components under `packages/registry`
- [ ] Verify / fill metadata gaps in registry

### 🟡 Priority 4 — Styles Package Audit
- [ ] Verify build behaviour of `packages/styles` (exports, public API)

### 🟢 Priority 5 — Stories / Docs Backlog
- [ ] Backlog stories in `apps/docs` and `apps/storybook`

### 🟢 Priority 6 — Repo Hygiene
- [x] Add `.DS_Store` and similar artefacts to `.gitignore`
- [ ] Keep transient planning artefacts out of the repo

### 🟢 Priority 7 — CI Hardening
- [ ] Wire `scripts/check-published-versions.js` into the CI pipeline
- [ ] Fix or mark `skip` on `Dropdown.keyboard.test.tsx` and open an issue

---

## Recommended Next Steps

1. **Finish release-doc consolidation** — reduce duplicate release guidance to one canonical set
2. **Keep the builder boundary incremental** — continue only with small, testable extractions
3. **Finalize repo hygiene** — remove any remaining stale planning/status artifacts
