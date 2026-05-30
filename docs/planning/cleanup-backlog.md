# Cleanup Backlog

## Goal
Reduce structural debt in the repository without changing product behavior.

## Priority 1: Builder boundary

### Objective
Turn `apps/builder` from a large orchestration surface into clearer domain, persistence, and UI layers.

### Tasks
1. Split state/domain logic out of `apps/builder/src/App.tsx` into a dedicated builder domain module.
2. Group persistence/repository code into a clearer data-access layer.
3. Keep UI panels/components separate from orchestration and mutation handlers.
4. Add a small boundary document for the builder package so future refactors follow the same shape.

### Acceptance criteria
- `App.tsx` only coordinates composition and top-level routing/state wiring.
- Domain helpers can be tested without rendering the app shell.
- Repository code is isolated from presentation code.

### Risk
- This is the highest-churn area in the repo; refactors must stay incremental.

## Priority 2: Documentation taxonomy

### Objective
Make docs easier to navigate by tightening the boundary between architecture, guides, release, and planning content.

### Tasks
1. Move `docs/planning/master-project-plan.md` into a stable architecture or development guide if it is still useful.
2. Merge duplicate or overlapping architecture guidance in `docs/guides/architecture.md` and `docs/architecture/README.md`.
3. Consolidate release docs into a smaller canonical set:
   - release runbook
   - launch checklist
   - release notes template
   - versioning policy
4. Add one index page per docs category so readers know where to start.

### Acceptance criteria
- Each docs folder has a single clear purpose.
- There are no duplicated “source of truth” docs for the same topic.
- New contributors can find architecture, usage, and release information without reading multiple overlapping files.

### Risk
- Over-consolidation can erase useful historical context, so migrations should preserve links or references.

## Priority 3: Repo hygiene

### Objective
Remove generated or accidental files and keep the repository clean.

### Tasks
1. Prevent `.DS_Store` and similar generated files from being tracked.
2. Reconfirm that transient planning artifacts stay out of the repo.
3. Keep validation artifacts out of committed source unless they are intentionally versioned.

### Acceptance criteria
- No accidental OS/editor files are committed.
- Planning and status files are only present when they provide current value.

### Risk
- Low. This is mostly housekeeping.

## Suggested order
1. Builder boundary
2. Documentation taxonomy
3. Repo hygiene

