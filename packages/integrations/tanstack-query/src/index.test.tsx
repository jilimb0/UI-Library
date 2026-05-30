import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const useQueryMock = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: (args: unknown) => useQueryMock(args),
}));

vi.mock('@ui-construction-library/core', () => ({
  DataTable: ({ data }: { data: Array<{ name: string }> }) => (
    <div>rows:{data.length}</div>
  ),
}));

import { AsyncDataTable } from './index';

describe('integration-tanstack-query', () => {
  it('shows loading and error states and renders the data table on success', async () => {
    useQueryMock.mockReturnValueOnce({
      data: [],
      isLoading: true,
      isError: false,
    });
    const { rerender } = render(
      <AsyncDataTable
        queryKey={['items']}
        queryFn={async () => []}
        columns={[]}
      />
    );
    expect(screen.getByText('Loading...')).toBeTruthy();

    useQueryMock.mockReturnValueOnce({
      data: [],
      isLoading: false,
      isError: true,
    });
    rerender(
      <AsyncDataTable
        queryKey={['items']}
        queryFn={async () => []}
        columns={[]}
      />
    );
    expect(screen.getByText('Failed to load data.')).toBeTruthy();

    useQueryMock.mockReturnValueOnce({
      data: [{ name: 'A' }],
      isLoading: false,
      isError: false,
    });
    rerender(
      <AsyncDataTable
        queryKey={['items']}
        queryFn={async () => []}
        columns={[]}
      />
    );
    expect(screen.getByText('rows:1')).toBeTruthy();
  });
});
