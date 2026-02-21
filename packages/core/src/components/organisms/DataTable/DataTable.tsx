import { useState, useMemo, ReactNode } from 'react';

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
}

function DataTable<T>({ data, columns, pageSize = 10 }: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  if (data.length === 0) return <div>No data</div>;

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

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const displayedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

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
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="cursor-pointer border border-gray-300 px-4 py-2"
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
          {displayedData.map((item, idx) => (
            <tr key={idx} className="border border-gray-300">
              {columns.map((col) => (
                <td key={col.key} className="border border-gray-300 px-4 py-2">
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-2">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-2 py-1 border rounded"
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;
