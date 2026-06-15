import { type QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { EmptyState, Skeleton } from '@ui-construction-library/core';
import type { ReactNode } from 'react';

export type QueryListPage<T> = {
  items: T[];
  nextCursor?: string | number | null;
};

export type QueryListProps<T> = {
  /** TanStack Query cache key. */
  queryKey: QueryKey;
  /** Paginated fetch — receives `{ pageParam }` and returns one page. */
  queryFn: (ctx: { pageParam?: string | number }) => Promise<QueryListPage<T>>;
  /** Render function for a single item. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Custom loading placeholder. */
  loadingFallback?: ReactNode;
  /** Custom error state. */
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
  /** Custom empty state. */
  emptyFallback?: ReactNode;
  /** Label for the "Load more" button. */
  loadMoreLabel?: string;
  /** Number of skeleton items shown while loading (default 3). */
  skeletonRows?: number;
};

/**
 * Infinite-scroll / load-more list backed by TanStack Query's `useInfiniteQuery`.
 *
 * @example
 * ```tsx
 * <QueryList<User>
 *   queryKey={['users-list']}
 *   queryFn={({ pageParam }) =>
 *     fetch(`/api/users?cursor=${pageParam ?? ''}`).then(r => r.json())
 *   }
 *   renderItem={(user) => <div>{user.name}</div>}
 * />
 * ```
 */
export function QueryList<T>({
  queryKey,
  queryFn,
  renderItem,
  loadingFallback,
  errorFallback,
  emptyFallback,
  loadMoreLabel = 'Load more',
  skeletonRows = 3,
}: QueryListProps<T>) {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<QueryListPage<T>>({
    queryKey,
    queryFn: ({ pageParam }) =>
      queryFn({ pageParam: pageParam as string | number | undefined }),
    initialPageParam: undefined as unknown as string | number,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  if (isLoading) {
    return (
      loadingFallback ?? (
        <div
          data-query-list-loading=""
          style={{ display: 'grid', gap: '0.5rem' }}
        >
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are stable by index
              key={`list-skeleton-${i}`}
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
        <div data-query-list-error="" role="alert">
          Failed to load data.
        </div>
      )
    );
  }

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (allItems.length === 0) {
    return (
      emptyFallback ?? (
        <EmptyState
          title="No items"
          description="There is nothing to display right now."
        />
      )
    );
  }

  return (
    <div data-query-list="">
      <div data-query-list-items="">
        {allItems.map((item, index) => renderItem(item, index))}
      </div>
      {hasNextPage && (
        <button
          type="button"
          onClick={() => void fetchNextPage()}
          disabled={isFetchingNextPage}
          data-query-list-load-more=""
          style={{ marginTop: '1rem' }}
        >
          {isFetchingNextPage ? 'Loading…' : loadMoreLabel}
        </button>
      )}
    </div>
  );
}
