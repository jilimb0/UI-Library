# Architecture

## Monorepo layout

- `apps/*`: playground/docs/storybook apps
- `packages/tokens`: design token source of truth
- `packages/core`: component library (atoms/molecules/organisms/templates)
- `packages/icons`: icon package
- `packages/integrations/*`: framework-specific adapters

## UI layers

1. **Atoms**: visual primitives (`Button`, `Input`, `Icon`, etc.)
2. **Molecules**: composed controls (`Pagination`, `ComboBox`, `SearchInput`, etc.)
3. **Organisms**: feature blocks (`Sidebar`, `Drawer`, `DataTable`, `Kanban`, etc.)
4. **Templates**: page-level layouts (`DashboardLayout`, `AuthLayout`, etc.)

## Core API conventions

- Controlled/uncontrolled naming:
  - `value` / `defaultValue` / `onChange`
  - `open` / `defaultOpen` / `onOpenChange`
- Visual API:
  - `variant`, `size`, `className`
- Polymorphism:
  - `as` for compatible primitives (`Button`, `Text`, `Heading`)
- Compound pattern for complex UI:
  - `Modal`, `Tabs`, `Accordion`

## Theming

- `@ui-construction-library/tokens` provides:
  - color scales `50..900`
  - semantic light/dark colors
  - motion/opacity tokens
  - CSS variable generator
  - Tailwind preset

## Integrations

- `integration-next`: Next.js wrappers
- `integration-tanstack-query`: async DataTable
- `integration-tanstack-router`: router adapters
- `integration-i18n`: translation provider/hook
