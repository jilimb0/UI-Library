import { useMatches } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

export type BreadcrumbSegment = {
  /** Display label for this breadcrumb. */
  label: string;
  /** Route path to navigate to. */
  to: string;
};

export type RouterBreadcrumbsProps = {
  /** Separator between segments (defaults to "/"). */
  separator?: ReactNode;
  /** CSS class name for the root `<nav>`. */
  className?: string;
};

/**
 * Breadcrumb trail automatically derived from TanStack Router matches.
 *
 * Each matched route segment is turned into a navigable breadcrumb link.
 * The current (leaf) segment is rendered as plain text with `aria-current="page"`.
 *
 * @example
 * ```tsx
 * // Route: /dashboard/123/settings
 * // Renders: Home / Dashboard / Settings
 * <RouterBreadcrumbs separator=" / " />
 * ```
 */
export function RouterBreadcrumbs({
  separator = ' / ',
  className,
}: RouterBreadcrumbsProps) {
  const matches = useMatches();

  const segments = useMemo<BreadcrumbSegment[]>(() => {
    return matches.map((match) => {
      // Prefer a `title` or `crumb` static field on the route, falling back to pathname
      const routeMeta = (
        match as unknown as { staticData?: Record<string, unknown> }
      ).staticData;
      const label =
        (routeMeta?.crumb as string) ??
        (routeMeta?.title as string) ??
        match.pathname.split('/').filter(Boolean).pop() ??
        'Home';

      return { label, to: match.pathname };
    });
  }, [matches]);

  if (segments.length === 0) return null;

  return (
    <nav data-breadcrumbs="" className={className} aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <li
              key={segment.to}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {index > 0 ? (
                <span data-breadcrumbs-separator="" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
              {isLast ? (
                <span aria-current="page">{segment.label}</span>
              ) : (
                <a
                  href={segment.to}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {segment.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
