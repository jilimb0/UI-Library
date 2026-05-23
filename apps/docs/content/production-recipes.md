# Production Recipes

This page contains copy-ready integration recipes for production apps.

---

## 1. Next.js App Router + ThemeProvider (SSR-safe)

All interactive components in `@ui-construction-library/core` are client components.  
Use a dedicated client provider and include it in `app/layout.tsx`.

```tsx
// app/providers.tsx
'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@ui-construction-library/core';
import '@ui-construction-library/core/styles';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
import { Button, Card, Heading, Text } from '@ui-construction-library/core';

export default function Page() {
  return (
    <Card className="p-6">
      <Heading as="h2">Dashboard</Heading>
      <Text>SSR-safe composition with client-ready components.</Text>
      <Button>Create project</Button>
    </Card>
  );
}
```

---

## 2. React Hook Form Integration

Use `@ui-construction-library/react-hook-form` wrappers to keep validation and UI state aligned.

```tsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@ui-construction-library/core';
import { FormField } from '@ui-construction-library/react-hook-form';

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export function AccountForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', fullName: '' },
    mode: 'onBlur',
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)} className="stack">
      <FormField control={form.control} name="fullName" label="Full name" />
      <FormField control={form.control} name="email" label="Email" />
      <Button type="submit" disabled={!form.formState.isValid}>
        Save
      </Button>
    </form>
  );
}
```

---

## 3. TanStack Query Integration (Table Data Flow)

Use the integration package for server-state workflows and keep rendering in core components.

```tsx
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { DataTable } from '@ui-construction-library/core';

const queryClient = new QueryClient();

type ProjectRow = { id: string; name: string; owner: string };

function ProjectsTable() {
  const { data = [], isLoading } = useQuery<ProjectRow[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to load projects');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading…</div>;

  return (
    <DataTable
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'owner', header: 'Owner' },
      ]}
      data={data}
    />
  );
}

export function ProjectsScreen() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsTable />
    </QueryClientProvider>
  );
}
```

---

## 4. Bundle Optimization Checklist

1. Import only used exports from `@ui-construction-library/core`.
2. Keep integration packages optional (`next`, `tanstack`, `react-hook-form`) per app boundary.
3. Track budgets in CI (`check-bundle-size.js`).
4. Prefer route-level code splitting for heavy screens.
