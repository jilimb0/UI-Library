# @ui-construction-library/integration-tanstack-query

TanStack Query adapter for the UI Construction Library. Provides data-driven components that wire `@tanstack/react-query` queries and mutations to core UI components.

## When to use

Use this package when your project uses `@tanstack/react-query` and you want:

- `QueryBoundary` — handles loading, error, and empty states declaratively
- `QueryTable` — renders a `DataTable` backed by a query
- `QueryList` — renders a list backed by a query
- `AsyncDataTable` — paginated, filterable table with server-side data fetching

## Installation

```bash
pnpm add @ui-construction-library/core @ui-construction-library/integration-tanstack-query @tanstack/react-query
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "@tanstack/react-query": ">=5.0.0"
}
```

## Minimal example

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryBoundary } from '@ui-construction-library/integration-tanstack-query';
import { DataTable } from '@ui-construction-library/core';

const queryClient = new QueryClient();

function UsersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryBoundary queryKey={['users']} queryFn={() => fetch('/api/users').then(r => r.json())}>
        {(data) => (
          <DataTable
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
            ]}
            data={data}
          />
        )}
      </QueryBoundary>
    </QueryClientProvider>
  );
}
```

## Components

| Component | Description |
|---|---|
| `QueryBoundary` | Renders children only when data is available. Shows `Spinner` during loading, empty state for empty arrays, and error state on failure. |
| `QueryTable` | Combines `QueryBoundary` + `DataTable`. Accepts a query configuration and column definitions. |
| `QueryList` | Renders a list of items from a query with loading, empty, and error states. |
| `AsyncDataTable` | DataTable with server-side pagination, sorting, and filtering. |

## Compatibility

- React 18 and 19
- @tanstack/react-query 5.x
- TypeScript 5.x and 6.x

## Public API

```ts
import { QueryBoundary, QueryTable, QueryList, AsyncDataTable } from '@ui-construction-library/integration-tanstack-query';
```

## Troubleshooting

**Data not loading** — confirm `QueryClientProvider` is added to your component tree above any `QueryBoundary` or `QueryTable`.

**Loading state never resolves** — check that your `queryFn` returns a promise and that the query key matches between the provider and consumer.
