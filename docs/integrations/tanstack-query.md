# TanStack Query Integration

**Package:** `@ui-construction-library/integration-tanstack-query`

## Install

```bash
pnpm add @ui-construction-library/integration-tanstack-query @tanstack/react-query
```

## Setup

Ensure a `QueryClientProvider` wraps your app before using any query components.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function App({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## Components

### QueryBoundary

Suspense + ErrorBoundary wrapper for query-consuming children. Use it to wrap any subtree that uses `useSuspenseQuery`.

```tsx
<QueryBoundary
  loadingFallback={<Skeleton />}
  errorFallback={(err, retry) => (
    <div>
      Error: {err.message}
      <button onClick={retry}>Retry</button>
    </div>
  )}
  queryKey={['users']}
>
  <UsersList />
</QueryBoundary>
```

### QueryTable

Data table pre-wired with loading skeleton, error state, and empty state from core.

```tsx
<QueryTable<User>
  queryKey={['users']}
  queryFn={() => fetch('/api/users').then(r => r.json())}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
  ]}
  pageSize={20}
/>
```

### QueryList

Infinite / load-more list backed by `useInfiniteQuery`.

```tsx
<QueryList<Comment>
  queryKey={['comments']}
  queryFn={({ pageParam }) =>
    fetch(`/api/comments?cursor=${pageParam ?? ''}`).then(r => r.json())
  }
  renderItem={(comment) => <div>{comment.body}</div>}
  loadMoreLabel="Show more"
/>
```

### AsyncDataTable (legacy)

Simple query-to-table binding. Prefer `QueryTable` for new code — it adds skeleton, error and empty states.

## Architecture notes

- All components accept custom `loadingFallback`, `errorFallback`, and `emptyFallback` slots.
- `QueryBoundary` uses a class-based `ErrorBoundary` (React requirement) and integrates with `queryClient.invalidateQueries` on retry.
- `QueryList` uses cursor-based pagination — return `{ items, nextCursor }` from `queryFn`.
