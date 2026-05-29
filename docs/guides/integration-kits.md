# Gold Integration Kits

Step-by-step setup guides for installing and wiring `@ui-construction-library/core` into the three primary ecosystems. Each kit is self-contained — follow the steps in order and you will have a running surface in under 30 minutes.

---

## Kit 1: Vite + React

**Target:** Single-page React apps, internal tools, playgrounds.

### 1. Create the project

```bash
pnpm create vite my-app --template react-ts
cd my-app
```

### 2. Install the library

```bash
pnpm add @ui-construction-library/core @ui-construction-library/tokens
```

### 3. Import the stylesheet

In `src/main.tsx`, import the bundled CSS before your own styles:

```tsx
import '@ui-construction-library/core/styles';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 4. Wrap with ThemeProvider

```tsx
// src/App.tsx
import { ThemeProvider, Button, Heading, Text } from '@ui-construction-library/core';

export default function App() {
  return (
    <ThemeProvider>
      <main style={{ padding: '2rem' }}>
        <Heading as="h1">My App</Heading>
        <Text>Built with UI Construction Library.</Text>
        <Button>Get started</Button>
      </main>
    </ThemeProvider>
  );
}
```

### 5. Verify

```bash
pnpm dev
# Open http://localhost:5173 — Button and Heading should render with theme tokens.
```

---

## Kit 2: Next.js App Router

**Target:** SSR-safe production apps, marketing sites, dashboards.

**Package:** `@ui-construction-library/integration-next`

### 1. Create the project

```bash
pnpm create next-app my-app --typescript --app --tailwind=false --eslint=false
cd my-app
```

### 2. Install the library

```bash
pnpm add @ui-construction-library/core @ui-construction-library/integration-next
```

### 3. Create a client providers wrapper

Next.js App Router requires client components for context providers. Create `app/providers.tsx`:

```tsx
// app/providers.tsx
'use client';

import { ThemeProvider } from '@ui-construction-library/core';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

### 4. Wire into the root layout

```tsx
// app/layout.tsx
import '@ui-construction-library/core/styles';
import { Providers } from './providers';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 5. Compose a page

```tsx
// app/page.tsx
import { Button, Card, Heading, Text } from '@ui-construction-library/core';

export default function Page() {
  return (
    <main style={{ padding: '2rem' }}>
      <Card style={{ padding: '1.5rem', maxWidth: '32rem' }}>
        <Heading as="h1">Dashboard</Heading>
        <Text>Your app is running with SSR-safe UI components.</Text>
        <Button>Open settings</Button>
      </Card>
    </main>
  );
}
```

### 6. Verify

```bash
pnpm dev
# Open http://localhost:3000 — Card and Button should render server-side.
```

---

## Kit 3: Static HTML (no bundler)

**Target:** Prototypes, email templates, CMS-embedded surfaces.

### 1. Download the built assets

Copy the built CSS from the package dist or use a CDN link (replace `x.x.x` with the current version):

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@ui-construction-library/core@x.x.x/dist/styles.css"
/>
```

### 2. Minimal HTML shell

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Static UI Kit</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@ui-construction-library/core@x.x.x/dist/styles.css"
    />
  </head>
  <body>
    <main style="padding: 2rem; font-family: var(--font-sans);">
      <h1 class="heading">Static page</h1>
      <p class="text">Using design tokens without a bundler.</p>
      <button class="button button--default">Get started</button>
    </main>
  </body>
</html>
```

### 3. Use design tokens directly

The stylesheet exposes CSS custom properties you can use in any context:

```css
.my-card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 2px);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}
```

---

## Kit 4: React Hook Form integration

**Package:** `@ui-construction-library/react-hook-form`

### 1. Install

```bash
pnpm add @ui-construction-library/react-hook-form react-hook-form zod @hookform/resolvers
```

### 2. Schema-driven form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@ui-construction-library/core';

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Input
        label="Email"
        type="email"
        {...register('email')}
        description={errors.email?.message}
      />
      <Input
        label="Name"
        {...register('name')}
        description={errors.name?.message}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Sign up'}
      </Button>
    </form>
  );
}
```

---

## Kit 5: TanStack Query + Router

**Packages:** `@ui-construction-library/integration-tanstack-query`, `@ui-construction-library/integration-tanstack-router`

### 1. Install

```bash
pnpm add @tanstack/react-query @tanstack/react-router
pnpm add @ui-construction-library/integration-tanstack-query
pnpm add @ui-construction-library/integration-tanstack-router
```

### 2. Query-backed table

```tsx
import { useQuery } from '@tanstack/react-query';
import { DataTable, Spinner } from '@ui-construction-library/core';

type User = { id: string; name: string; email: string; role: string };

export function UsersTable() {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((r) => r.json()),
  });

  if (isLoading) return <Spinner />;

  return (
    <DataTable
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
      ]}
      data={data ?? []}
    />
  );
}
```

### 3. Router-bound navigation

```tsx
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Button } from '@ui-construction-library/core';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div>
      <h1>Home</h1>
      <Button onClick={() => router.navigate({ to: '/dashboard' })}>
        Go to dashboard
      </Button>
    </div>
  ),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
});
```

---

## Validation contract

A kit is considered **gold** when all of the following are true:

| Criterion | Check |
|---|---|
| Typecheck passes | `pnpm --filter <integration-package> typecheck` exits 0 |
| Copy-ready examples present | This document contains runnable code for each kit |
| CI validates kit docs | `docs/guides/integration-kits.md` is present and non-empty |
| No peer dependency warnings | `pnpm install` produces no unmet peer warnings for the kit |
