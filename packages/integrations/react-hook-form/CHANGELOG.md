# @ui-construction-library/react-hook-form

## 0.4.0

### Minor Changes

- e0c5394: feat: 10/10 business readiness — real SECURITY.md with PGP key and disclosure SLA, full CODE_OF_CONDUCT.md with enforcement, dependency review + SBOM in CI, signed commits policy, browser compatibility matrix, cross-browser E2E (chromium + firefox + webkit), .browserslistrc, error boundary docs, v1.0 release checklist, DataTable load tests, per-package npm READMEs (behaviors, i18n, next, tanstack-query, tanstack-router), root README badges, create-ucl-app CLI, GOVERNANCE.md, SUPPORT.md, public ROADMAP.md, expanded Component API docs (64 components), English utilities API, mutation testing (Stryker), post-publish smoke dashboard

### Patch Changes

- Updated dependencies [e0c5394]
  - @ui-construction-library/core@0.4.0

## 0.3.0

### Minor Changes

- 2285993: Improvement product readiness

### Patch Changes

- Updated dependencies [2285993]
  - @ui-construction-library/core@0.3.0

## 0.2.2

### Patch Changes

- Updated dependencies [656cfdf]
  - @ui-construction-library/core@0.2.2

## 0.2.1

### Patch Changes

- ae9901c: fix: post-release patch fixes for build reliability and TypeScript correctness

  - **core**: correct `tsconfig.json` include globs — scoped test patterns to `src/` to prevent accidental inclusion of files outside source tree
  - **react-hook-form**: fix TS2322 in `FormField` — cast `Input` to plain FC signature to avoid `RefAttributes<any>` type collapse under TS6 + strict project references
  - **export-core**: fix import path in smoke test script
  - **prompt-engine**: update diagnostic level from `warn` to `warning`, add `NOT_IMPLEMENTED` code

- Updated dependencies [ae9901c]
  - @ui-construction-library/core@0.2.1

## 0.2.0

### Minor Changes

- 8e364a3: Upgrade product readiness

### Patch Changes

- Updated dependencies [8e364a3]
  - @ui-construction-library/core@0.2.0

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.3

### Features

- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))
- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))
- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))
- update styles and tokens for consistency and improved design ([1b9fb2e](../../commit/1b9fb2e))

### Chores

- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2

### Features

- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))
- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))
- update styles and tokens for consistency and improved design ([1b9fb2e](../../commit/1b9fb2e))

### Chores

- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1 — 2026-05-22

### Features

- enhance Select and Dropdown components with custom icon support ([222de55](../../commit/222de55))

### Bug Fixes

- **build:** clean repo ([a57d08d](../../commit/a57d08d))

### Refactoring

- enhance contributing guidelines and remove unnecessary files ([b8f186d](../../commit/b8f186d))
- rename packages from '@ui-lib/_' to '@ui-construction-library/_' across the codebase, updating imports, paths, and configurations accordingly ([796d6ce](../../commit/796d6ce))

### Chores

- update dependency management and project structure ([e0a675d](../../commit/e0a675d))
- add Renovate configuration for automated dependency management and update pnpm-lock.yaml with new chromatic version ([281e871](../../commit/281e871))
- update dependencies in pnpm-lock.yaml, package.json, and tsconfig.json files; improve TypeScript configuration and build scripts ([86c6a50](../../commit/86c6a50))
- remove Prettier and ESLint configurations, add Biome configuration, and update project structure ([dae8d49](../../commit/dae8d49))
- remove ESLint configuration, update dependencies, and upgrade Storybook to version 10.4.0 ([00e9291](../../commit/00e9291))
- update project structure and dependencies, add changelog and contributing guidelines ([ad77d1c](../../commit/ad77d1c))

### Other

- v0.1.0 ([873d61f](../../commit/873d61f))

---

# @ui-construction-library/react-hook-form

## 0.1.1

### Patch Changes

- Updated dependencies [3332676]
  - @ui-construction-library/core@0.1.1
