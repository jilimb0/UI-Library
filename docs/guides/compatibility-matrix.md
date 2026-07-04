# Compatibility Matrix

## Runtime and Framework Support

| Surface | Supported | Notes |
| --- | --- | --- |
| Node.js | `24.x` | Strict policy, CI runs on Node 24 |
| pnpm | `11.x` | Locked by `packageManager` and Volta |
| React | `18.x` | Required by all UI packages |
| React DOM | `18.x` | Required by all UI packages |
| Next.js | `15.x` (integration target) | Via `@ui-construction-library/integration-next` |
| TanStack Query | `5.x` | Via integration package |
| TanStack Router | `1.x` | Via integration package |

## Browser Support

| Browser | Supported | CI Validation |
| --- | --- | --- |
| Chromium (Chrome, Edge) | Latest 2 major versions | Playwright E2E |
| Firefox | Latest 2 major versions | Playwright E2E |
| WebKit (Safari) | Latest 2 major versions | Playwright E2E |

## Package Guarantees

| Package | Compatibility Contract |
| --- | --- |
| `@ui-construction-library/core` | Stable public exports, semver-governed |
| `@ui-construction-library/primitives` | Internal behavior may evolve, public API semver-governed |
| `@ui-construction-library/tokens` | CSS variable names treated as public contract |
| `@ui-construction-library/integration-*` | Optional adapters, versioned independently |
| `@ui-construction-library/react-hook-form` | Optional adapter, follows RHF major line |

## Migration Guarantees

1. Breaking changes only in major releases.
2. Deprecated APIs remain for at least one minor cycle.
3. Every breaking change ships with migration documentation.
4. CI checks enforce API snapshot and dependency boundaries.

## Validation Gates

Compatibility is validated by:

- Typecheck across all packages.
- Unit/integration/e2e test suites.
- Build checks for all apps and packages.
- API snapshot checks.
- Visual regression checks in Chromatic workflow.
