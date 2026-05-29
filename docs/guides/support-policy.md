# Support Policy & Compatibility Matrix

This document defines what the UI Construction Library guarantees, what it does not, and which package versions are compatible with which runtimes and frameworks.

---

## Support tiers

### Tier 1 — Fully supported

These packages receive bug fixes, security patches, and API stability guarantees. Breaking changes require a major version bump and a migration guide entry.

| Package | Current version | Notes |
|---|---|---|
| `@ui-construction-library/core` | 0.1.1 | Primary component surface |
| `@ui-construction-library/primitives` | 0.1.0 | Headless overlay primitives |
| `@ui-construction-library/tokens` | — | Design token layer |
| `@ui-construction-library/icons` | — | Icon asset layer |
| `@ui-construction-library/utils` | — | Shared utility functions |

### Tier 2 — Maintained

These packages receive bug fixes and are kept compatible with Tier 1. New features are added on a best-effort basis.

| Package | Notes |
|---|---|
| `@ui-construction-library/motion` | Animation primitives |
| `@ui-construction-library/dnd` | Drag-and-drop layer |
| `@ui-construction-library/schema` | Validation schema contracts |
| `@ui-construction-library/registry` | Component registry |
| `@ui-construction-library/export-core` | Export pipeline |
| `@ui-construction-library/prompt-engine` | Prompt-to-UI engine |

### Tier 3 — Integration packages (best-effort)

These packages wrap third-party libraries. They are updated when the upstream library releases breaking changes, but are not guaranteed to track every minor upstream release.

| Package | Upstream dependency |
|---|---|
| `@ui-construction-library/react-hook-form` | `react-hook-form` |
| `@ui-construction-library/integration-next` | `next` |
| `@ui-construction-library/integration-tanstack-query` | `@tanstack/react-query` |
| `@ui-construction-library/integration-tanstack-router` | `@tanstack/react-router` |
| `@ui-construction-library/integration-i18n` | `i18next` / `react-i18next` |

### Tier 4 — Experimental

These surfaces are not covered by stability guarantees. APIs may change without a major version bump during the experimental phase.

- Builder app (`apps/builder`) — internal tooling, not a published package
- Playground and demo-showcase apps
- Phase 7 runtime expansion targets beyond `react-single-page`, `html-static`, `web-components-static`, and `nextjs-app-router`

---

## Compatibility matrix

### React

| Library version | React 18 | React 19 |
|---|---|---|
| core 0.1.x | ✅ | ✅ (tested) |
| primitives 0.1.x | ✅ | ✅ (tested) |
| motion | ✅ | ✅ |
| dnd | ✅ | not yet tested |

### Node.js (build tooling only — not a runtime dependency)

| Node version | Build | Typecheck | Tests |
|---|---|---|---|
| 20 LTS | ✅ | ✅ | ✅ |
| 22 LTS | ✅ | ✅ | ✅ |
| 18 | ✅ | ✅ | ✅ |

### Package managers

| Manager | Supported |
|---|---|
| pnpm 9+ | ✅ primary |
| npm 10+ | ✅ |
| yarn 4+ | ✅ |

### Bundlers

| Bundler | Supported |
|---|---|
| Vite 5+ | ✅ |
| Next.js 15 (App Router) | ✅ |
| Rollup 4+ | ✅ (used internally) |
| webpack 5 | ✅ (community-tested) |
| esbuild | ✅ (via Vite) |

### TypeScript

| Version | Supported |
|---|---|
| 5.x | ✅ |
| 6.x | ✅ (used internally) |
| 4.x | not supported |

---

## What is guaranteed

- **API stability within a major version.** Props, types, and exported function signatures will not change in a breaking way within a major version.
- **Accessible defaults.** All interactive components ship with correct ARIA roles, keyboard navigation, and focus management by default.
- **Deterministic exports.** The same IR input to `renderExportProject` will always produce the same file output for a given target.
- **Typecheck clean on every release.** No release is published with TypeScript errors.
- **Test suite green on every release.** No release is published with failing tests.

## What is not guaranteed

- **Visual pixel-perfect stability.** CSS class names and token values may change between minor versions. Use semantic class names and token references, not hardcoded values.
- **Internal module paths.** Do not import from `dist/src/...` or `src/internal/...` paths directly. Only the public index exports are stable.
- **Builder app stability.** The builder is an internal tool. Its component APIs and state shape may change without notice.
- **Experimental targets.** Export targets beyond the four listed in Tier 2 are not covered by the deterministic output guarantee.

---

## Deprecation policy

1. A deprecation notice is added to the relevant export with a JSDoc `@deprecated` tag.
2. The deprecated API is kept for at least one minor version cycle.
3. The migration guide is updated with a before/after example.
4. The API is removed in the next major version.

---

## Security

Security vulnerabilities in Tier 1 and Tier 2 packages are patched as soon as possible and released as patch versions. See `SECURITY.md` in the repository root for the full disclosure policy and contact details.

---

## Versioning

This library follows [Semantic Versioning](https://semver.org/):

- **Patch** (`0.x.y → 0.x.y+1`): bug fixes, documentation updates, internal refactors with no API change.
- **Minor** (`0.x.y → 0.x+1.0`): new features, new exports, new props with defaults. No breaking changes.
- **Major** (`0.x.y → 1.0.0`): breaking API changes. Always accompanied by a migration guide entry.

The library is currently in `0.x` — minor versions may include small breaking changes during this pre-1.0 phase, always documented in `docs/migration/MIGRATION-GUIDE.md`.
