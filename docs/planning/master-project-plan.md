# Project Master Plan

## Purpose

This document is the single source of truth for what still needs to be done in the project. It replaces fragmented roadmap notes, scorecard epics, and stale closeout trackers.

---

## 1. Product Positioning & Pillars

### Positioning Statement
UI Construction Library is a deterministic UI production system for teams that need guided generation, governed editing, and trustworthy exports.

### What it is better at
- Turning a prompt into a builder-compatible draft.
- Preserving manual edits while allowing controlled regeneration.
- Producing runnable exports that stay predictable across targets.
- Supporting collaboration, versioning, and publish governance in the same workflow.

### What it is not
- A raw text-to-code novelty tool.
- A loose component collection without workflow guarantees.
- A design toy that only looks good in screenshots.

### Messaging Pillars
1. **Deterministic structure** — same structured input should produce the same structural output.
2. **Governed editing** — users can accept, reject, or repair changes without losing control.
3. **Production-trustworthy exports** — exported artifacts are validated, inspectable, and runnable.
4. **Collaboration-aware workflows** — roles, history, and publish state are first-class.

---

## 2. Product Readiness & Classifications

### Capability Matrix

| Area | Current State | Evidence | Readiness |
|---|---|---|---|
| Core component library | Modular package structure with build/lint/typecheck/test maturity across core packages | `packages/core`, `primitives`, `motion`, `registry`, `schema`, `utils`, `tokens`, `styles` package manifests | Product-ready |
| Builder editing shell | Real builder app with canvas/tree/inspector/editor/collaboration-oriented surfaces | `apps/builder/src/App.tsx`, `components/*`, `builderControllers.ts`, `editorState.ts` | Product-ready |
| Persistence and collaboration | Repository-backed persistence, comments, versions, members, publish flows, auth/session path | `apps/builder/src/persistence.ts`, `dataServices.ts`, `membershipService.ts`, `publishService.ts`, `auth.ts` | Product-ready |
| Prompt-to-UI engine | Deterministic prompt contracts, validation, repair, builder-compatible output, tests | `packages/prompt-engine/src/index.ts`, `packages/prompt-engine/src/index.test.ts` | Platform-ready |
| Export pipeline | Deterministic IR, diagnostics, dependency analysis, multi-target render slices, tests | `packages/export-core/src/index.ts`, `packages/export-core/src/index.test.ts` | Platform-ready |
| Docs app / public docs | Dedicated docs app and broad docs surface exist | `apps/docs/package.json`, `docs/*` | Platform-ready |
| Demo/showcase surfaces | Dedicated showcase and playground apps exist | `apps/demo-showcase`, `apps/playground`, `apps/storybook` | Platform-ready |
| Runtime/framework expansion | Strategy docs and initial target slices exist, but support policy is still evolving | `docs/architecture/framework-expansion-strategy.md`, `phase-7-*`, export targets | Experimental |
| End-to-end flagship product journeys | Five canonical flagship flows are now packaged as runnable demos in the demo showcase | `apps/demo-showcase/src/components/*Demo.tsx`, `flagshipFlows.ts` | Product-ready |

### Recommended Current Launch Posture
Current overall posture: **design partner beta**.
The repository now packages canonical flagship user journeys as runnable demos, has matured export-core and prompt-engine packages, and is ready for targeted design partner validation.

---

## 3. Flagship Flows

This section defines the canonical proof flows. Each flow must exist as a prompt input, a builder state, an exported artifact, and a runnable demo surface.

### 1. SaaS Landing Page
- **Prompt input:** conversion-focused landing page for a B2B analytics product
- **Builder state:** hero, proof strip, pricing teaser, and trial CTA with section-level regeneration
- **Exported artifact:** React single-page export with route-aware shell and deterministic tokens
- **Runnable demo:** showcase hero and architecture sections

### 2. Dashboard Shell
- **Prompt input:** admin dashboard with KPI cards, dense tables, and quick filters
- **Builder state:** edit mode, tree operations, inspector editing, and batch-safe interactions
- **Exported artifact:** route-backed app shell export with table and layout primitives
- **Runnable demo:** data-heavy component gallery and live table interactions

### 3. Settings App
- **Prompt input:** account settings with profile editing, notification preferences, and security toggles
- **Builder state:** review mode with validation, comments, and protected edits
- **Exported artifact:** form-driven React or HTML export with typed state and accessible controls
- **Runnable demo:** form integration surface and modal interaction examples

### 4. Docs Page
- **Prompt input:** docs page with sticky sidebar, section anchors, and code examples
- **Builder state:** review and publish modes that preserve the documented page structure
- **Exported artifact:** multi-page export with route structure and shared theme layer
- **Runnable demo:** architecture, integrations, and hooks sections in the showcase

### 5. Pricing Site
- **Prompt input:** pricing page with clear plan tiers, comparison logic, and trust language
- **Builder state:** publish mode with role gating, version selection, and publish history
- **Exported artifact:** deterministic static or React export with pricing sections and theme tokens
- **Runnable demo:** theme playground and polished hero surface

---

## 4. SKU & Packaging Model

| SKU | Audience | Included |
| --- | --- | --- |
| **Open-source core** | Individual contributors and evaluators | Builder, library packages, docs, demo showcase, baseline exports |
| **Hosted builder** | Teams that want managed editing | Collaboration, persistence, publish flows, identity, and usage diagnostics |
| **Enterprise collaboration** | Larger teams and regulated orgs | Governance controls, advanced roles, audit trails, supportability guarantees |
| **Export packs** | Teams shipping into multiple runtimes | Target-specific export pipelines and framework adapters |
| **Template packs** | Marketing, docs, SaaS, dashboard, pricing | Opinionated starting points and flagship flows |

### Boundary Rules
- Keep the open-source core usable without a hosted backend.
- Treat hosted collaboration and enterprise governance as paid product surfaces.
- Package runtime targets separately when they require distinct support guarantees.
- Keep template packs opinionated, but never required for basic product adoption.

---

## 5. Remaining Work (TODO List)

### 1. Prompt and review experience
- [x] Expand prompt recipe coverage beyond the current deterministic baseline.
- [x] Make component-family selection explicit for more product shapes and section combinations.
- [x] Add richer semantic diff summaries that mention prop-level and intent-level changes.
- [x] Continue improving repair suggestions so generated drafts need less manual cleanup.
- [x] Add more review-state visibility for accepted / rejected / pending generated sections.

### 2. Collaboration and governance
- [x] Add stronger role and policy UX for member management, publish, and recovery flows.
- [x] Add explicit audit trail summaries for risky actions and recovery events.
- [x] Tighten remote collaboration warnings and safe-action boundaries.
- [x] Add clearer beta-ready packaging criteria for design partners.

### 3. Export quality
- [x] Add additional export target coverage only when it improves the quality bar.
- [x] Expand golden export fixtures for more representative builder-shaped projects.
- [x] Broaden dependency and import derivation coverage in export analysis.
- [x] Strengthen the acceptance checklist so target graduation is tied to artifacts, not claims.
- [x] Keep export diagnostics actionable for unsupported nodes, assets, and target gaps.

### 4. Accessibility and API quality
- [x] Continue the component-by-component accessibility contract checklist.
- [x] Continue keyboard and focus management coverage for complex interactive patterns.
- [x] Continue API consistency work across size / variant / value contracts.
- [x] Add codemod and migration notes for any breaking contract changes.
- [x] Maintain visual regression, performance, and compatibility gates in CI.

### 5. Adoption and packaging
- [x] Finish the gold integration kits for the main ecosystems.
- [x] Expand production recipes and copy-ready examples.
- [x] Publish a public quality dashboard for release confidence.
- [x] Strengthen the support-policy and compatibility-matrix docs.
- [x] Keep the launch-tier model aligned with actual validation coverage.

### 6. Platform and runtime expansion
- [x] Continue the Phase 7 runtime expansion contract only after the current export baseline remains excellent.
- [x] Add new runtime targets only when they preserve deterministic file output and backward compatibility.
- [x] Keep the export pipeline target-agnostic at the IR layer.
- [x] Update architecture docs when the real support matrix changes.

### 7. Repo hygiene
- [x] Remove stale planning docs and closeout notes once their contents have been consolidated.
- [x] Keep roadmap docs aligned with actual package maturity and test coverage.
- [x] Remove obsolete or duplicate references when master docs replace them.

---

## 6. Closed Baseline

The following areas are considered complete for the current plan and should be treated as baseline, not open work:
- autosave recovery fingerprinting
- publish/version history summary surfaces
- publish validation gates
- export doctor diagnostics surfaced in the builder
- prompt signature and recipe summary contracts
- demo / Storybook / docs flagship packaging

---

## 7. Owner Notes

- Use this document before starting new implementation work.
- When a task is completed, update this file first, then retire the older source doc if it became redundant.
- If a future requirement is added, place it in the relevant section rather than creating a parallel roadmap.
