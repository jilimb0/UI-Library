# Package Layers — Universal Design Core Architecture

This document classifies every package in the `@ui-construction-library` monorepo
into its architectural layer as defined by the Universal Design Core strategy.

---

## Layer A — Universal Core (framework-agnostic)

These packages have **zero framework dependencies** and can be consumed by any
JS/TS environment — React, Vue, Svelte, Angular, vanilla JS, build tools, or
design-tooling pipelines.

| Package | npm name | Role |
|---------|----------|------|
| `tokens` | `@ui-construction-library/tokens` | Design tokens as TS objects, JSON, and CSS custom properties (`--ucl-*`) |
| `styles` | `@ui-construction-library/styles` | Pure CSS layer (reset, component classes, utilities) consuming only tokens |
| `behaviors` | `@ui-construction-library/behaviors` | Pure JS state machines, ARIA attributes, and interaction logic |
| `utils` | `@ui-construction-library/utils` (internal) | Generic JS utilities — date, number, string, object helpers |

### Principles

- No `react`, `vue`, `svelte`, or other framework imports.
- Pure TS/JS + CSS only.
- Export in multiple formats (TS, JSON, CSS vars, Tailwind preset).
- Stable, semver-governed public API.

---

## Layer B — React Adapter (reference implementation)

These packages depend on React and serve as the **first and primary consumer**
of the Universal Core. They wire behaviors, tokens, and styles into idiomatic
React components.

| Package | npm name | Role |
|---------|----------|------|
| `primitives` | `@ui-construction-library/primitives` | Headless React components (Slot, Field, Switch, Dialog, Tabs, etc.) — consume `behaviors` |
| `core` | `@ui-construction-library/core` | Styled React components — consume `primitives` + `styles` + `tokens` |
| `icons` | `@ui-construction-library/icons` | SVG React icon components |
| `motion` | `@ui-construction-library/motion` | Animation React components |
| `dnd` | `@ui-construction-library/dnd` | Drag-and-drop React components |
| `integration-next` | `@ui-construction-library/integration-next` | Next.js App Router adapter |
| `integration-tanstack-query` | `@ui-construction-library/integration-tanstack-query` | TanStack Query adapter |
| `integration-tanstack-router` | `@ui-construction-library/integration-tanstack-router` | TanStack Router adapter |
| `integration-react-hook-form` | `@ui-construction-library/integration-react-hook-form` | React Hook Form adapter |
| `integration-i18n` | `@ui-construction-library/integration-i18n` | i18next adapter |

### Principles

- All React-specific: hooks, context, `forwardRef`, JSX.
- Primitives delegate ARIA/state logic to `behaviors`.
- Core components delegate styling to `styles` + `tokens`.
- Integrations are adapters that bridge core with third-party React libraries.

---

## Layer C — Other Framework Adapters (future)

Not yet implemented. When demand arises, new adapter packages will be created
that consume the Universal Core (tokens + styles + behaviors) and wrap them in
idiomatic components for other frameworks.

| Potential Package | Target Framework |
|-------------------|-----------------|
| `adapter-vue` | Vue 3 Composition API |
| `adapter-solid` | Solid.js |
| `adapter-angular` | Angular signals / standalone components |

---

## DevTools / Internal (not consumer-facing)

These packages support internal tooling, code generation, and the Builder app.
They are **not part of the public API** and should not be imported by consumers.

| Package | npm name | Role |
|---------|----------|------|
| `schema` | `@ui-construction-library/schema` (internal) | Zod schemas for builder domain model |
| `registry` | `@ui-construction-library/registry` (internal) | Component recipe registry |
| `prompt-engine` | `@ui-construction-library/prompt-engine` (internal) | AI prompt generation for builder |
| `export-core` | `@ui-construction-library/export-core` (internal) | Export pipeline core logic |

---

## Dependency Rules

```
Layer A (Universal Core)
  └── NO framework dependencies
  └── tokens → (no deps)
  └── styles → tokens (CSS vars only)
  └── behaviors → (no deps, pure JS)
  └── utils → (no deps, pure JS)

Layer B (React Adapter)
  └── primitives → behaviors, utils
  └── core → primitives, tokens, styles
  └── icons, motion, dnd → core, tokens
  └── integrations → core (+ third-party peer deps)

Layer C (Future Adapters)
  └── adapter-* → tokens, styles, behaviors (from Layer A)

DevTools / Internal
  └── schema, registry, prompt-engine, export-core
  └── May depend on any layer; not depended on by Layers A/B/C
```
