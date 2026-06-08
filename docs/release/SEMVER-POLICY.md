# Semver Policy

This document defines the versioning strategy for all packages in `@ui-construction-library`.

## Version ranges

| Range | Stage | Breaking changes | Audience |
|-------|-------|-----------------|----------|
| `0.1.x` | Internal preview | Allowed in any release | Early adopters, internal builder app |
| `0.2.x` | Public preview | Allowed with migration guide and CHANGELOG entry | External teams evaluating the library |
| `0.3.x+` | Stable | **Not allowed** in minor or patch releases | Production consumers |
| `1.x+` | Mature | Not allowed; major bumps for breaking changes only | Long-term platform adoption |

## What counts as a breaking change

- Removing a named export from a public package.
- Changing a prop type in a way that requires consumer code changes.
- Changing a CSS custom property name or removing one.
- Removing a `data-*` attribute used for styling hooks.
- Changing the minimum supported React or Next.js version.

## What is NOT a breaking change

- Adding a new named export.
- Adding an optional prop to an existing component.
- Adding a new CSS custom property.
- Bug fixes that change behavior to match documented intent.
- Internal refactors with no effect on public API surface.
- Changes to internal packages (`styles`, `utils`, `schema`, `registry`, `export-core`, `prompt-engine`).

## Changelog format

Every release must include a `CHANGELOG.md` entry with:

```markdown
## [0.2.3] — 2025-01-15

### Added
- `FormFieldArray` component for dynamic list fields.

### Changed
- `QueryTable` now shows `EmptyState` instead of blank when data is empty.

### Fixed
- `NextThemeProvider` hydration mismatch on first paint.
```

### Breaking changes section

When a breaking change is introduced (allowed in `0.1.x` and `0.2.x`), include a dedicated section:

```markdown
### Breaking
- Removed `AsyncDataTable` `renderEmpty` prop — use `emptyFallback` instead.

### Migration
- Replace `renderEmpty={() => <div>...</div>}` with `emptyFallback={<div>...</div>}`.
```

## Package versioning

All public packages are versioned independently. Internal packages follow `0.1.x` indefinitely.

### Public packages
- `@ui-construction-library/core`
- `@ui-construction-library/tokens`
- `@ui-construction-library/styles`
- `@ui-construction-library/behaviors`
- `@ui-construction-library/primitives`
- `@ui-construction-library/icons`
- `@ui-construction-library/integration-next`
- `@ui-construction-library/react-hook-form`
- `@ui-construction-library/integration-tanstack-query`
- `@ui-construction-library/integration-tanstack-router`

### Internal packages (not versioned for consumers)
- `@ui-construction-library/utils`
- `@ui-construction-library/schema`
- `@ui-construction-library/registry`
- `@ui-construction-library/export-core`
- `@ui-construction-library/prompt-engine`

## Release process

1. **Changeset**: Every PR that modifies a public package must include a changeset describing the change type (patch / minor / major).
2. **CI check**: The release pipeline validates that the changeset version bump matches semver rules.
3. **Publish**: Packages are published to npm via the release workflow after CI passes.
4. **Tag**: A git tag `v{package}@{version}` is created for each published package.
