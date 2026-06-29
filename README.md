# UI Construction Library

[![npm version](https://img.shields.io/npm/v/@ui-construction-library/core?label=core&logo=npm)](https://www.npmjs.com/package/@ui-construction-library/core)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@ui-construction-library/core?label=bundle)](https://bundlephobia.com/package/@ui-construction-library/core)
[![CI](https://github.com/jilimb0/UI-Library/actions/workflows/ci.yml/badge.svg)](https://github.com/jilimb0/UI-Library/actions/workflows/ci.yml)
[![Chromatic](https://img.shields.io/badge/visual-Chromatic-8444FF?logo=storybook)](https://main--6692d4e8c3a6b656d6e58e60.chromatic.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/@ui-construction-library/core?label=downloads)](https://www.npmjs.com/package/@ui-construction-library/core)

[![Open in StackBlitz](https://img.shields.io/badge/Open%20in-StackBlitz-1269D3?logo=stackblitz)](https://stackblitz.com/github/jilimb0/UI-Library/tree/main/apps/playground)
[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-151515?logo=codesandbox)](https://githubbox.com/jilimb0/UI-Library/tree/main/apps/playground)

Universal Design Core (tokens, styles, behaviors) for any JS/TS framework, plus a React reference implementation with ready-to-use components and integrations.

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
| `@ui-construction-library/styles` | Universal CSS layer (reset, utilities, component classes) | You need framework-agnostic CSS |
| `@ui-construction-library/behaviors` | Framework-agnostic behaviors (ARIA, interactions, state) | You need headless logic outside React |
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
| Framework-agnostic CSS | `pnpm add @ui-construction-library/styles @ui-construction-library/tokens` |
| Framework-agnostic behaviors | `pnpm add @ui-construction-library/behaviors @ui-construction-library/styles @ui-construction-library/tokens` |
| UI + icons | `pnpm add @ui-construction-library/core @ui-construction-library/icons` |
| UI + forms | `pnpm add @ui-construction-library/core @ui-construction-library/react-hook-form react-hook-form` |
| UI + drag and drop | `pnpm add @ui-construction-library/core @ui-construction-library/dnd` |
| UI + animation | `pnpm add @ui-construction-library/core @ui-construction-library/motion` |
| Next.js app | `pnpm add @ui-construction-library/core @ui-construction-library/integration-next` |

## Import rules

```ts
// ✅ Components — always from core
import { Button, Modal, DataTable } from '@ui-construction-library/core'

// ✅ Universal Core — tokens, styles, behaviors
import { rawTokens, semanticTokens } from '@ui-construction-library/tokens'
import '@ui-construction-library/tokens/css'
import '@ui-construction-library/styles/styles.css'
import { createDialogBehavior } from '@ui-construction-library/behaviors'

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

## Community

- [GitHub Discussions](https://github.com/jilimb0/UI-Library/discussions) — Q&A, ideas, community
- [Roadmap](./ROADMAP.md) — public product roadmap
- [Contributing](./.github/CONTRIBUTING.md) — how to contribute
- [Code of Conduct](./.github/CODE_OF_CONDUCT.md) — community standards
- [Security](./.github/SECURITY.md) — reporting vulnerabilities
- [Governance](./GOVERNANCE.md) — project governance
- [Support](./SUPPORT.md) — where to get help
