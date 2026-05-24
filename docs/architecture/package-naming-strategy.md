# Package Naming Strategy

## Decision
- Keep `@ui-construction-library/core` as the primary React runtime package in the near term for compatibility.
- Introduce explicit aliases (e.g. `core-react`) only when multi-runtime implementations begin.

## Rationale
- Avoid churn for current users and CI/release flows.
- Defer naming expansion until concrete adapters/exporters exist.

## Future-ready names (reserved)
- `@ui-construction-library/core-react`
- `@ui-construction-library/core-web`
- `@ui-construction-library/styles`
- `@ui-construction-library/registry`

## Trigger for migration
Start migration when the first non-React runtime package reaches beta and requires explicit runtime distinction.
