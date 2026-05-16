import { type QueryKey, useQuery } from '@tanstack/react-query';
import { DataTable } from '@ui-construction-library/core';
import type { ReactNode } from 'react';

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
