import { type QueryKey, useQuery } from '@tanstack/react-query';
import { DataTable } from '@ui-construction-library/core';
import type { ReactNode } from 'react';

export type { QueryBoundaryProps } from './QueryBoundary';
export { QueryBoundary } from './QueryBoundary';
export type { QueryListPage, QueryListProps } from './QueryList';
export { QueryList } from './QueryList';
export type { QueryTableProps } from './QueryTable';
export { QueryTable } from './QueryTable';

// ---------------------------------------------------------------------------
// Legacy — AsyncDataTable (kept for backward compatibility)
// ---------------------------------------------------------------------------

type Column<T> = {
  key: string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => ReactNode;
};

interface AsyncDataTableProps<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T[]>;
  columns: Column<T>[];
  pageSize?: number;
}

/** @deprecated Use `QueryTable` instead, which adds skeleton, error and empty states. */
export function AsyncDataTable<T>({
  queryKey,
  queryFn,
  columns,
  pageSize,
}: AsyncDataTableProps<T>) {
  const { data = [], isLoading, isError } = useQuery({ queryKey, queryFn });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load data.</div>;

  return <DataTable data={data} columns={columns} pageSize={pageSize} />;
}
