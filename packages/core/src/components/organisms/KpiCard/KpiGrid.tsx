import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface KpiGridProps {
  children: ReactNode;
  /** Number of columns. Defaults to auto-fill with min 16rem. */
  columns?: number;
  className?: string;
}

export function KpiGrid({ children, columns, className }: KpiGridProps) {
  return (
    <div
      className={cn('kpi-grid', className)}
      style={
        columns
          ? {
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
