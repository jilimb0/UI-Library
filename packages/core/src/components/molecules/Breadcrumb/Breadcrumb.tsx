import type { CSSProperties, ReactNode } from 'react';
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
  style?: CSSProperties;
}

export function Breadcrumb({
  items,
  separator = '/',
  className,
  style,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('breadcrumb', className)}
      style={style}
    >
      <ol className="inline-cluster">
        {items.map((item, index) => {
          const content = item.href ? (
            <a
              href={item.href}
              onClick={item.onClick}
              className="breadcrumb__link"
            >
              {item.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className="breadcrumb__link"
            >
              {item.label}
            </button>
          );

          return (
            <li key={item.href ?? String(index)} className="inline-cluster">
              <span
                className={cn(item.current && 'breadcrumb__current')}
                aria-current={item.current ? 'page' : undefined}
              >
                {content}
              </span>
              {index < items.length - 1 ? (
                <span className="pagination-ellipsis">{separator}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
