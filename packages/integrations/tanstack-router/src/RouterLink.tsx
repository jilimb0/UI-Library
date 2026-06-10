import { Link as TanStackRouterLink } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export type RouterLinkProps = {
  /** TanStack Router route path (e.g. "/dashboard/$dashboardId"). */
  to: string;
  /** Route params for dynamic segments. */
  params?: Record<string, string | number>;
  /** Search params to include. */
  search?: Record<string, string | number | boolean>;
  /** Inline content. */
  children: ReactNode;
  /** CSS class name passed to the underlying anchor. */
  className?: string;
  /** Whether to disable the link. */
  disabled?: boolean;
};

/**
 * TanStack Router-aware link that composes with the design-system styles.
 *
 * Renders a TanStack `<Link>` which handles client-side route transitions,
 * while accepting standard design-system className for styling.
 *
 * @example
 * ```tsx
 * <RouterLink to="/dashboard/$dashboardId" params={{ dashboardId: '1' }}>
 *   Open dashboard
 * </RouterLink>
 * ```
 */
export function RouterLink({
  to,
  params,
  search,
  children,
  className,
  disabled,
}: RouterLinkProps) {
  if (disabled) {
    return (
      <span
        data-router-link-disabled=""
        className={className}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <TanStackRouterLink
      to={to}
      params={params}
      search={search}
      className={className}
    >
      {children}
    </TanStackRouterLink>
  );
}
