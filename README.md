# UI Construction Library

Composable React UI system for product teams that need a consistent design language across demos, docs, Storybook and application surfaces.

---

## Quick start

```bash
pnpm add @ui-construction-library/core
```

```tsx
import { ThemeProvider, Button, Input } from '@ui-construction-library/core';
import '@ui-construction-library/core/styles.css';

export function App() {
  return (
    <ThemeProvider>
      <Input label="Project name" placeholder="Aurora Dashboard" />
      <Button>Get started</Button>
    </ThemeProvider>
  );
}
```

---

## Package architecture

| Package | Role | Install when |
|---|---|---|
| `@ui-construction-library/core` | **Primary entrypoint** — components, themes, hooks | Always — start here |
| `@ui-construction-library/tokens` | Design tokens, CSS variables, Tailwind preset | Explicit theming or token access |
| `@ui-construction-library/icons` | Standalone React icon components | You need icons |
| `@ui-construction-library/primitives` | Headless overlay primitives (Dialog, Popover…) | Building custom overlays |
| `@ui-construction-library/motion` | Animation extensions (FadeIn, SlideIn, Bounce…) | You want animated transitions |
| `@ui-construction-library/dnd` | Drag-and-drop (DndContext, Kanban, sortable…) | You need drag-and-drop |
| `@ui-construction-library/react-hook-form` | Form adapters for react-hook-form | You use react-hook-form |
| `@ui-construction-library/integration-next` | Next.js App Router providers | Next.js projects |
| `@ui-construction-library/integration-tanstack-query` | TanStack Query data components | TanStack Query projects |
| `@ui-construction-library/integration-tanstack-router` | TanStack Router navigation | TanStack Router projects |
| `@ui-construction-library/integration-i18n` | i18next locale wrappers | i18n projects |
| `@ui-construction-library/utils` | Internal infrastructure helpers | **Library maintainers only** |

## Installation matrix

| Scenario | Command |
|---|---|
| Basic UI | `pnpm add @ui-construction-library/core` |
| UI + explicit theming | `pnpm add @ui-construction-library/core @ui-construction-library/tokens` |
| UI + icons | `pnpm add @ui-construction-library/core @ui-construction-library/icons` |
| UI + forms | `pnpm add @ui-construction-library/core @ui-construction-library/react-hook-form react-hook-form` |
| UI + drag and drop | `pnpm add @ui-construction-library/core @ui-construction-library/dnd` |
| UI + animation | `pnpm add @ui-construction-library/core @ui-construction-library/motion` |
| Next.js app | `pnpm add @ui-construction-library/core @ui-construction-library/integration-next` |

## Import rules

```ts
// ✅ Components — always from core
import { Button, Modal, DataTable } from '@ui-construction-library/core'

// ✅ Icons — from icons
import { SearchIcon } from '@ui-construction-library/icons'

// ✅ Extensions — from their dedicated packages
import { FormField } from '@ui-construction-library/react-hook-form'

// ❌ Do not import from utils in application code
// ❌ Do not use deep imports (dist/*, src/*)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full dependency model and rules.

---

## Entry points

- **Demo showcase** — product-oriented live demo with ThemeProvider, integrations, hooks and motion
- **Documentation site** — install flow, category reference, package overview and adoption guidance
- **Storybook** — component exploration and design-system stories

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## Validation

```bash
pnpm check:boundaries   # package architecture rules
pnpm validate           # full platform validation
pnpm release:preflight  # pre-release checks
```

## Docs

- [Architecture](./ARCHITECTURE.md) — package roles, dependency graph, import policy
- [Package architecture guide](./docs/guides/package-architecture.md) — consumer-facing version
- [Integration kits](./docs/guides/integration-kits.md) — step-by-step setup for Vite, Next.js, Static, RHF, TanStack
- [Migration guide](./docs/migration/MIGRATION-GUIDE.md) — API changes and codemod patterns
- [AI agent guide](./docs/guides/ai-agent-guide.md) — import rules and recipes for AI agents
- [Accessibility contract](./docs/guides/accessibility-contract.md) — WCAG 2.1 AA audit per component
- [Support policy](./docs/guides/support-policy.md) — compatibility matrix and stability guarantees
