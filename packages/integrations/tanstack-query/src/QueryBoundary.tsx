import { type QueryKey, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Component, type ErrorInfo, Suspense } from 'react';

// ---------------------------------------------------------------------------
// ErrorBoundary (class-based — React requires a class for error boundaries)
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  fallback: ReactNode | ((error: Error, retry: () => void) => ReactNode);
  onReset?: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class QueryErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[QueryBoundary]', error, info.componentStack);
  }

  private handleReset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      return typeof fallback === 'function'
        ? fallback(error, this.handleReset)
        : fallback;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// QueryBoundary
// ---------------------------------------------------------------------------

export type QueryBoundaryProps = {
  /** Content rendered while the query is loading (shown inside `<Suspense>`). */
  loadingFallback?: ReactNode;
  /** Content or render function shown when the query throws an error. */
  errorFallback?: ReactNode | ((error: Error, retry: () => void) => ReactNode);
  /** Optional query key — when provided, `retry` invalidates the query before re-rendering. */
  queryKey?: QueryKey;
  children: ReactNode;
};

/**
 * Wraps query-consuming children with `Suspense` + an error boundary.
 *
 * @example
 * ```tsx
 * <QueryBoundary
 *   loadingFallback={<Skeleton />}
 *   errorFallback={(err, retry) => <div>Failed: {err.message} <button onClick={retry}>Retry</button></div>}
 *   queryKey={['users']}
 * >
 *   <UsersList />
 * </QueryBoundary>
 * ```
 */
export function QueryBoundary({
  loadingFallback = <div data-query-loading="">Loading…</div>,
  errorFallback,
  queryKey,
  children,
}: QueryBoundaryProps) {
  const queryClient = useQueryClient();

  const resolvedErrorFallback:
    | ReactNode
    | ((error: Error, retry: () => void) => ReactNode) =
    errorFallback ??
    ((err: Error, retry: () => void) => (
      <div data-query-error="" role="alert">
        <p>Something went wrong: {err.message}</p>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    ));

  return (
    <QueryErrorBoundary
      fallback={resolvedErrorFallback}
      onReset={() => {
        if (queryKey) {
          void queryClient.invalidateQueries({ queryKey });
        }
      }}
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </QueryErrorBoundary>
  );
}
