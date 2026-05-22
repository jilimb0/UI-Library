import type { ChangeEvent } from 'react';
import { cn } from '../../../utils/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

function buildVisiblePages(
  page: number,
  totalPages: number
): Array<number | 'ellipsis'> {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push('ellipsis');

  pages.push(totalPages);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className,
}: PaginationProps) {
  const visiblePages = buildVisiblePages(page, totalPages);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handlePageSize = (event: ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange?.(Number(event.target.value));
  };

  let ellipsisCount = 0;

  return (
    <div
      className={cn(
        'mt-4 flex flex-wrap items-center justify-between gap-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className="inline-flex items-center justify-center rounded border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((item) => {
            if (item === 'ellipsis') {
              ellipsisCount += 1;
              return (
                <span
                  key={`ellipsis-${ellipsisCount}`}
                  className="px-2 text-slate-500"
                >
                  ...
                </span>
              );
            }

            const isActive = item === page;
            return (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex min-w-8 items-center justify-center rounded border px-2 py-1 text-sm',
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700'
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className="inline-flex items-center justify-center rounded border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>

      {onPageSizeChange && typeof pageSize === 'number' ? (
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Page size
          <select
            value={pageSize}
            onChange={handlePageSize}
            className="rounded border border-slate-300 px-2 py-1"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
