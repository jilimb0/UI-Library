import { type QueryKey, useQuery } from '@tanstack/react-query';
import { DataTable, EmptyState, Skeleton } from '@ui-construction-library/core';
import type { ReactNode } from 'react';

type Column<T> = {
  key: string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => ReactNode;
};

export type QueryTableProps<T> = {
  /** TanStack Query cache key. */
  queryKey: QueryKey;
  /** Function that fetches the row data. */
  queryFn: () => Promise<T[]>;
  /** Column definitions passed to `DataTable`. */
  columns: Column<T>[];
  /** Page size passed to `DataTable`. */
  pageSize?: number;
  /** Custom loading placeholder. */
  loadingFallback?: ReactNode;
  /** Custom error state. */
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
  /** Custom empty state shown when `data.length === 0`. */
  emptyFallback?: ReactNode;
  /** Number of skeleton rows to show while loading (default 5). */
  skeletonRows?: number;
};

/**
 * Data table pre-wired with TanStack Query loading, error and empty states.
 *
 * @example
 * ```tsx
 * <QueryTable<User>
 *   queryKey={['users']}
 *   queryFn={() => fetch('/api/users').then(r => r.json())}
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email' },
 *   ]}
 * />
 * ```
 */
export function QueryTable<T>({
  queryKey,
  queryFn,
  columns,
  pageSize,
  loadingFallback,
  errorFallback,
  emptyFallback,
  skeletonRows = 5,
}: QueryTableProps<T>) {
  const { data, isLoading, isError, error } = useQuery({ queryKey, queryFn });

  if (isLoading) {
    return (
      loadingFallback ?? (
        <div
          data-query-table-loading=""
          style={{ display: 'grid', gap: '0.5rem' }}
        >
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are stable by index
              key={`table-skeleton-${i}`}
              style={{ height: '2rem', width: '100%' }}
            />
          ))}
        </div>
      )
    );
  }

  if (isError) {
    const fallback =
      typeof errorFallback === 'function'
        ? errorFallback(error as Error)
        : errorFallback;

    return (
      fallback ?? (
        <div data-query-table-error="" role="alert">
          Failed to load data.
        </div>
      )
    );
  }

  const rows = data ?? [];

  if (rows.length === 0) {
    return (
      emptyFallback ?? (
        <EmptyState
          title="No records found"
          description="There are no items to display right now."
        />
      )
    );
  }

  return <DataTable data={rows} columns={columns} pageSize={pageSize} />;
}
