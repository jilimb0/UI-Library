import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@ui-construction-library/core', () => ({
  DataTable: ({
    data,
  }: {
    data: Array<Record<string, unknown>>;
    columns: Array<{ key: string; header: string }>;
  }) => <div data-testid="data-table">rows:{data.length}</div>,
  EmptyState: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      <span>{description}</span>
    </div>
  ),
  Skeleton: (props: Record<string, unknown>) => (
    <div data-testid="skeleton" style={props.style as React.CSSProperties} />
  ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

afterEach(() => {
  cleanup();
});

function createWrapper(queryClient?: QueryClient) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('QueryBoundary', () => {
  it('should render children when no error occurs', async () => {
    const { QueryBoundary } = await import('../QueryBoundary');

    render(
      <QueryBoundary>
        <div data-testid="content">Hello</div>
      </QueryBoundary>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('content').textContent).toBe('Hello');
  });

  it('should show error fallback when child throws', async () => {
    const { QueryBoundary } = await import('../QueryBoundary');

    function Broken(): never {
      throw new Error('Test error');
    }

    // Suppress console.error from the error boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <QueryBoundary>
        <Broken />
      </QueryBoundary>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/Something went wrong/)).toBeDefined();
    expect(screen.getByText(/Test error/)).toBeDefined();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('should render custom errorFallback function', async () => {
    const { QueryBoundary } = await import('../QueryBoundary');

    function Broken(): never {
      throw new Error('Custom error');
    }

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <QueryBoundary
        errorFallback={(err: Error, retry: () => void) => (
          <div data-testid="custom-error">
            <span>{err.message}</span>
            <button type="button" onClick={retry}>
              Retry
            </button>
          </div>
        )}
      >
        <Broken />
      </QueryBoundary>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('custom-error')).toBeDefined();
    expect(screen.getByText('Custom error')).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('should render custom errorFallback ReactNode', async () => {
    const { QueryBoundary } = await import('../QueryBoundary');

    function Broken(): never {
      throw new Error('Error');
    }

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <QueryBoundary errorFallback={<div data-testid="static-error">Oops</div>}>
        <Broken />
      </QueryBoundary>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('static-error')).toBeDefined();
    expect(screen.getByText('Oops')).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('should render loadingFallback inside Suspense', async () => {
    const { QueryBoundary } = await import('../QueryBoundary');

    // Create a promise that never resolves to trigger Suspense
    const neverResolve: Promise<void> = new Promise(() => {});

    function SuspendForever(): never {
      throw neverResolve;
    }

    render(
      <QueryBoundary
        loadingFallback={<div data-testid="loading">Loading...</div>}
      >
        <SuspendForever />
      </QueryBoundary>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('loading')).toBeDefined();
    expect(screen.getByText('Loading...')).toBeDefined();
  });
});

describe('QueryTable', () => {
  it('should show loading state initially', async () => {
    const { QueryTable } = await import('../QueryTable');

    // Create a query that never resolves to keep loading
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryTable
        queryKey={['loading-items']}
        queryFn={() => new Promise<Array<{ id: number }>>(() => {})}
        columns={[{ key: 'id', header: 'ID' }]}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(5);
  });

  it('should show error state when query fails', async () => {
    const { QueryTable } = await import('../QueryTable');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Trigger a query that will fail
    queryClient.setQueryDefaults(['error-items'], { retry: false });

    render(
      <QueryTable
        queryKey={['error-items']}
        queryFn={() => Promise.reject(new Error('API Error'))}
        columns={[{ key: 'id', header: 'ID' }]}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    // Use act to flush the promise
    await vi.waitFor(() => {
      expect(screen.getByText('Failed to load data.')).toBeDefined();
    });
  });

  it('should show empty state when data is empty', async () => {
    const { QueryTable } = await import('../QueryTable');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Pre-populate cache with empty data
    queryClient.setQueryData(['empty-items'], []);

    render(
      <QueryTable
        queryKey={['empty-items']}
        queryFn={() => Promise.resolve([])}
        columns={[{ key: 'id', header: 'ID' }]}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    // Should transition through loading to empty state
    await vi.waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeDefined();
    });
  });

  it('should render DataTable when data is available', async () => {
    const { QueryTable } = await import('../QueryTable');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    queryClient.setQueryData(['items'], [{ id: 1 }, { id: 2 }]);

    render(
      <QueryTable
        queryKey={['items']}
        queryFn={() => Promise.resolve([{ id: 1 }, { id: 2 }])}
        columns={[{ key: 'id', header: 'ID' }]}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    await vi.waitFor(() => {
      expect(screen.getByTestId('data-table')).toBeDefined();
    });
    expect(screen.getByText('rows:2')).toBeDefined();
  });

  it('should render custom errorFallback', async () => {
    const { QueryTable } = await import('../QueryTable');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryTable
        queryKey={['custom-error']}
        queryFn={() => Promise.reject(new Error('Oops'))}
        columns={[{ key: 'id', header: 'ID' }]}
        errorFallback={<div data-testid="custom-error-msg">Custom Error</div>}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    await vi.waitFor(() => {
      expect(screen.getByTestId('custom-error-msg')).toBeDefined();
    });
  });

  it('should render custom loadingFallback', async () => {
    const { QueryTable } = await import('../QueryTable');

    render(
      <QueryTable
        queryKey={['never-loads']}
        queryFn={() => new Promise<Array<{ id: number }>>(() => {})}
        columns={[{ key: 'id', header: 'ID' }]}
        loadingFallback={<div data-testid="custom-loading">Loading...</div>}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('custom-loading')).toBeDefined();
  });
});

describe('QueryList', () => {
  it('should show loading state initially', async () => {
    const { QueryList } = await import('../QueryList');

    render(
      <QueryList
        queryKey={['loading-list']}
        queryFn={(): Promise<never> => new Promise(() => {})}
        renderItem={(item: { name: string }) => <div>{item.name}</div>}
      />,
      { wrapper: createWrapper() }
    );

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('should show error state when query fails', async () => {
    const { QueryList } = await import('../QueryList');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryList
        queryKey={['list-error']}
        queryFn={() => Promise.reject(new Error('Failed'))}
        renderItem={(item: { name: string }) => <div>{item.name}</div>}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    await vi.waitFor(() => {
      expect(screen.getByText('Failed to load data.')).toBeDefined();
    });
  });

  it('should render items when data is available', async () => {
    const { QueryList } = await import('../QueryList');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Pre-populate with test data
    queryClient.setQueryData(['list-items'], {
      pages: [
        {
          items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
          nextCursor: undefined,
        },
      ],
      pageParams: [undefined],
    });

    render(
      <QueryList
        queryKey={['list-items']}
        queryFn={() =>
          Promise.resolve({
            items: [{ name: 'Item 1' }],
          })
        }
        renderItem={(item: { name: string }) => (
          <div data-testid="list-item">{item.name}</div>
        )}
        loadMoreLabel="Load More"
      />,
      { wrapper: createWrapper(queryClient) }
    );

    await vi.waitFor(() => {
      const items = screen.getAllByTestId('list-item');
      expect(items.length).toBe(3);
    });
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
    expect(screen.getByText('Item 3')).toBeDefined();
  });

  it('should show empty state for empty data', async () => {
    const { QueryList } = await import('../QueryList');

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    queryClient.setQueryData(['empty-list'], {
      pages: [{ items: [], nextCursor: undefined }],
      pageParams: [undefined],
    });

    render(
      <QueryList
        queryKey={['empty-list']}
        queryFn={() => Promise.resolve({ items: [] })}
        renderItem={(item: { name: string }) => <div>{item.name}</div>}
      />,
      { wrapper: createWrapper(queryClient) }
    );

    await vi.waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeDefined();
    });
  });
});
