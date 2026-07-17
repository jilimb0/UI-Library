# @ui-construction-library/prompt-engine

## 0.3.1

### Patch Changes

- Updated dependencies
  - @ui-construction-library/registry@0.3.1

## 0.3.0

### Minor Changes

- 8d83152: chore: V1 readiness — test hardening, Storybook coverage, bundle budgets, security

### Patch Changes

- Updated dependencies [8d83152]
  - @ui-construction-library/registry@0.3.0
  - @ui-construction-library/schema@0.3.0

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.2.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))
- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))

### Bug Fixes

- **packages:** add repository field to export-core and prompt-engine; bump prompt-engine to 0.1.3 ([610b19d](../../commit/610b19d))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))
- update build scripts to include TypeScript declaration generation and improve package descriptions ([a42b53b](../../commit/a42b53b))
- **packages:** workspace:\* for ALL remaining internal cross-package deps ([b7c5d5b](../../commit/b7c5d5b))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages ([ef40f62](../../commit/ef40f62))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.2 — 2026-05-30

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.2.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))
- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))

### Bug Fixes

- **packages:** add repository field to export-core and prompt-engine; bump prompt-engine to 0.1.3 ([610b19d](../../commit/610b19d))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))
- update build scripts to include TypeScript declaration generation and improve package descriptions ([a42b53b](../../commit/a42b53b))
- **packages:** workspace:\* for ALL remaining internal cross-package deps ([b7c5d5b](../../commit/b7c5d5b))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages ([ef40f62](../../commit/ef40f62))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.2 — 2026-05-30

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

## 0.2.0

### Minor Changes

- 2285993: Improvement product readiness

### Patch Changes

- Updated dependencies [2285993]
  - @ui-construction-library/registry@0.2.0
  - @ui-construction-library/schema@0.2.0

## 0.1.1

### Patch Changes

- ae9901c: fix: post-release patch fixes for build reliability and TypeScript correctness

  - **core**: correct `tsconfig.json` include globs — scoped test patterns to `src/` to prevent accidental inclusion of files outside source tree
  - **react-hook-form**: fix TS2322 in `FormField` — cast `Input` to plain FC signature to avoid `RefAttributes<any>` type collapse under TS6 + strict project references
  - **export-core**: fix import path in smoke test script
  - **prompt-engine**: update diagnostic level from `warn` to `warning`, add `NOT_IMPLEMENTED` code

## 0.2.0

### Minor Changes

- 8e364a3: Upgrade product readiness

### Patch Changes

- Updated dependencies [8e364a3]
  - @ui-construction-library/registry@0.2.0
  - @ui-construction-library/schema@0.2.0

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2 — 2026-05-30

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2 — 2026-05-30

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2 — 2026-05-30

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Chores

- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/prompt-engine

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

### Other

- Refactor version repository and update documentation ([9314a07](../../commit/9314a07))
- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))
