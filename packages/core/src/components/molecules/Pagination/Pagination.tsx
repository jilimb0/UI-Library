import { type ChangeEvent, forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange?: (page: number) => void;
  onValueChange?: (page: number) => void;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  style?: React.CSSProperties;
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

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onChange,
      onValueChange,
      onPageChange,
      pageSize,
      pageSizeOptions = [10, 20, 50, 100],
      onPageSizeChange,
      className,
      style,
    },
    ref
  ) => {
    const emitPageChange = (nextPage: number) => {
      onPageChange(nextPage);
      onChange?.(nextPage);
      onValueChange?.(nextPage);
    };
    const visiblePages = buildVisiblePages(page, totalPages);
    const canPrev = page > 1;
    const canNext = page < totalPages;

    const handlePageSize = (event: ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange?.(Number(event.target.value));
    };

    let ellipsisCount = 0;

    return (
      <div ref={ref} className={cn('pagination', className)} style={style}>
        <div className="pagination__controls">
          <button
            type="button"
            onClick={() => canPrev && emitPageChange(page - 1)}
            disabled={!canPrev}
            className="pagination-btn"
          >
            Prev
          </button>

          <div className="pagination__pages">
            {visiblePages.map((item) => {
              if (item === 'ellipsis') {
                ellipsisCount += 1;
                return (
                  <span
                    key={`ellipsis-${ellipsisCount}`}
                    className="pagination-ellipsis"
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
                  onClick={() => emitPageChange(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'pagination-btn',
                    isActive && 'pagination-btn--active'
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => canNext && emitPageChange(page + 1)}
            disabled={!canNext}
            className="pagination-btn"
          >
            Next
          </button>
        </div>

        <span className="pagination-meta">
          Page {page} of {totalPages}
        </span>

        {onPageSizeChange && typeof pageSize === 'number' ? (
          <label className="inline-cluster pagination-meta">
            Page size
            <select
              value={pageSize}
              onChange={handlePageSize}
              className="pagination-select"
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
);

Pagination.displayName = 'Pagination';

export default Pagination;
