# Implementation Plan — Remaining Master Plan Scopes

This plan details the complete implementation design for all remaining checklist items in the [Project Master Plan](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/docs/planning/master-project-plan.md).

---

## 1. Prompt & Review Experience

### Goal
Enhance layout generation recipes, support explicit component-family selection, improve repair rules, and build canvas-level review visibility.

#### [MODIFY] [packages/prompt-engine/src/index.ts](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/prompt-engine/src/index.ts)
- **Recipe Expansion**: Add additional design tokens and responsive pattern modifiers in `deriveCompositionPlan`.
- **Explicit Component-Family Selection**: Expose an optional `componentFamily` string on `PromptRequest` to let clients explicitly target primitive libraries (e.g. `@ui-construction-library/primitives`, `@ui-construction-library/motion`).
- **Improved Repair Feedback**: Enhance diagnostics inside `repairPromptDraftProject` to offer specific repair code recommendations.

#### [MODIFY] [apps/builder/src/App.tsx](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/apps/builder/src/App.tsx)
- **Canvas Review State**: Implement review-state overlays on layout sections showing badges for `pending`, `accepted`, or `rejected`.
- Add controls to toggle node review statuses before final export/publish.

---

## 2. Collaboration & Governance

### Goal
Provide role-based member control actions, render human-readable audit trails, and introduce safety banners.

#### [MODIFY] [apps/builder/src/components/MemberManagementPanel.tsx](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/apps/builder/src/components/MemberManagementPanel.tsx)
- Implement role-selection dropdowns and invite validations enforced by `memberPolicy.ts`.

#### [MODIFY] [apps/builder/src/components/EventTimelinePanel.tsx](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/apps/builder/src/components/EventTimelinePanel.tsx)
- Render descriptive audit timeline nodes detailing member invite, role change, layout recovery, and publishing events.

#### [MODIFY] [apps/builder/src/components/RemoteSyncBanner.tsx](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/apps/builder/src/components/RemoteSyncBanner.tsx)
- Build a synchronization state indicator that warns user if network connectivity to Supabase database is lost or delayed.

---

## 3. Export & Platform Expansion

### Goal
Strengthen export dependency derivation, enhance diagnostic details, and target next-generation runtimes.

#### [MODIFY] [packages/export-core/src/index.ts](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/export-core/src/index.ts)
- **Dependency & Import Derivation**: Expand target analyzer `analyzeExportProject` to scan component usage recursively and append deep package imports (e.g. adding motion bindings).
- **Graduation Checklist**: Enforce the `ExportAcceptanceChecklist` criteria within visual rendering validation flows.
- **Actionable Diagnostics**: Return exact line highlights for unsupported nodes or target gaps.

#### [NEW] [packages/export-core/src/targets/nextjs-target.ts](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/export-core/src/targets/nextjs-target.ts)
- Introduce a Next.js App Router export generator target, keeping rendering pipeline abstract via the Intermediate Representation (IR).

---

## 4. Accessibility & API Quality

### Goal
Maintain comprehensive focus control and ensure variant contracts are uniform across libraries.

#### [MODIFY] [packages/core/src/components/](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/core/src/)
- Audit component props to align all sizes (`sm`, `md`, `lg`) and variant signatures uniformly.
- Wire keyboard focus traps inside Modals and Dropdowns using accessibly name tags.

#### [NEW] [docs/migration/MIGRATION-GUIDE.md](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/docs/migration/MIGRATION-GUIDE.md)
- Document break changes, offering CLI-based codemod patterns.

---

## 5. Adoption, Packaging & Docs

### Goal
Create ecosystem integration kits, design public quality reports, and compile support matrices.

#### [NEW] [apps/docs/src/pages/integration-kits.md](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/apps/docs/src/pages/integration-kits.md)
- Complete step-by-step guides for installing and wrapping exported structures inside Vite, Next.js, and static setups.

#### [NEW] [apps/docs/src/components/QualityDashboard.tsx](file:///Users/jilimbo/Documents/PersonalProjects/UI-Library/apps/docs/src/components/QualityDashboard.tsx)
- Embed a public release quality dashboard reporting real-time E2E test results, visual differences, and bundle sizes.

---

## Verification Plan

### Automated Tests
- Run typechecks and unit suites across packages and apps:
  ```bash
  pnpm typecheck
  pnpm test
  ```
- Run axe-playwright accessibility audits on all views:
  ```bash
  pnpm check:e2e
  ```
