import { type ReactNode, useMemo, useState } from 'react';
import { Pagination } from '../../molecules/Pagination';
import { EmptyState } from '../EmptyState';

interface Column<T> {
  key: string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  pageSizeOptions?: number[];
}

function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [activePageSize, setActivePageSize] = useState(pageSize);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      return 0;
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / activePageSize);

  const displayedData = useMemo(() => {
    const start = (currentPage - 1) * activePageSize;
    return sortedData.slice(start, start + activePageSize);
  }, [sortedData, currentPage, activePageSize]);

  if (data.length === 0) {
    return (
      <EmptyState
        title="No data"
        description="There are no records to display for this table."
      />
    );
  }

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'cursor-pointer' : undefined}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.header}
                {sortColumn === col.key
                  ? sortDirection === 'asc'
                    ? ' ▲'
                    : ' ▼'
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item, _idx) => (
            <tr key={JSON.stringify(item)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={currentPage}
        totalPages={Math.max(totalPages, 1)}
        onPageChange={setCurrentPage}
        pageSize={activePageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={(nextPageSize) => {
          setActivePageSize(nextPageSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default DataTable;
