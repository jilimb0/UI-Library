import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

export function Breadcrumb({
  items,
  separator = '/',
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-sm text-slate-600', className)}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const content = item.href ? (
            <a
              href={item.href}
              onClick={item.onClick}
              className="hover:text-slate-900"
            >
              {item.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className="hover:text-slate-900"
            >
              {item.label}
            </button>
          );

          return (
            <li
              key={item.href ?? String(index)}
              className="inline-flex items-center gap-2"
            >
              <span
                className={cn(item.current && 'font-semibold text-slate-900')}
                aria-current={item.current ? 'page' : undefined}
              >
                {content}
              </span>
              {index < items.length - 1 ? (
                <span className="text-slate-400">{separator}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
