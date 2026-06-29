# Getting Started

`@ui-construction-library` is a React UI system with a single primary entrypoint and optional extension packages. Most projects need only `core` to get going.

---

## 1. Install

```bash
pnpm add @ui-construction-library/core
```

---

## 2. Import the stylesheet

Add this once in your app entry point (e.g. `main.tsx` or `_app.tsx`):

```ts
import '@ui-construction-library/core/styles.css'
```

---

## 3. Wrap your app with `ThemeProvider`

```tsx
import { ThemeProvider } from '@ui-construction-library/core'

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}
```

---

## 4. Use components

```tsx
import { Button, Input, Modal } from '@ui-construction-library/core'

function LoginForm() {
  return (
    <form>
      <Input label="Email" type="email" />
      <Input label="Password" type="password" />
      <Button type="submit">Sign in</Button>
    </form>
  )
}
```

---

## Add icons

```bash
pnpm add @ui-construction-library/icons
```

```tsx
import { SearchIcon, CloseIcon } from '@ui-construction-library/icons'

<Button leftIcon={<SearchIcon />}>Search</Button>
```

---

## Add explicit theming

```bash
pnpm add @ui-construction-library/tokens
```

```ts
import '@ui-construction-library/tokens/css'
```

See [Package Architecture](./package-architecture.md) for the full installation matrix.

---

## Optional extensions

| What you need | Package | Extra peer deps |
|---|---|---|
| Form validation with react-hook-form | `@ui-construction-library/react-hook-form` | `react-hook-form` |
| Drag and drop | `@ui-construction-library/dnd` | — |
| Animated transitions | `@ui-construction-library/motion` | — |
| i18n locale-aware wrappers | `@ui-construction-library/integration-i18n` | — |
| Next.js App Router SSR | `@ui-construction-library/integration-next` | `next` |
| TanStack Query data UI | `@ui-construction-library/integration-tanstack-query` | `@tanstack/react-query` |
| TanStack Router navigation | `@ui-construction-library/integration-tanstack-router` | `@tanstack/react-router` |
| Headless primitives (custom overlays) | `@ui-construction-library/primitives` | — |

---

## Form example with react-hook-form

```bash
pnpm add @ui-construction-library/react-hook-form react-hook-form
```

```tsx
import { useForm } from 'react-hook-form'
import { FormField, FormProvider } from '@ui-construction-library/react-hook-form'
import { Button } from '@ui-construction-library/core'

function SettingsForm() {
  const methods = useForm<{ name: string }>()

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <FormField name="name" label="Display name" />
        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}
```

---

## Next.js App Router example

```bash
pnpm add @ui-construction-library/integration-next next
```

```tsx
// app/providers.tsx — must be a Client Component
'use client'

import { NextUIProvider } from '@ui-construction-library/integration-next'
import '@ui-construction-library/core/styles.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>
}
```

---

## Error boundaries

Components from `@ui-construction-library/core` are designed to fail gracefully when wrapped in a React error boundary. We recommend wrapping your app (or at minimum each route/page) with an error boundary:

```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Text } from '@ui-construction-library/core';

class AppErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[UI Library] Caught render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: '2rem' }}>
          <Text>Something went wrong. Please refresh the page.</Text>
        </div>
      );
    }
    return this.props.children;
  }
}
```

The library's theme provider (`ThemeProvider`) does not catch rendering errors in its children — always wrap it with your own error boundary.

## Package boundaries

- **Always import components from `core`** — never from `utils`, `styles`, `schema`, `registry`, `export-core`, or `prompt-engine`.
- **No deep imports** — `@ui-construction-library/core/dist/Button` is not supported and may break between versions.
- See [AI Agent Guide](./ai-agent-guide.md) for automated-tooling import rules.
- See [Package Architecture](./package-architecture.md) for the full dependency model.
