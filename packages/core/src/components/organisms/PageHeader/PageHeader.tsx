import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface PageHeaderBreadcrumb {
  key: string;
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  /** Page title. */
  title: string;
  /** Optional subtitle or description. */
  subtitle?: string;
  /** Breadcrumb trail rendered above the title. */
  breadcrumbs?: PageHeaderBreadcrumb[];
  /** Action buttons rendered on the right side (e.g., "Create", "Export"). */
  actions?: ReactNode;
  /** Additional class name. */
  className?: string;
}

/**
 * PageHeader — page-level heading with breadcrumbs, subtitle, and action slots.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Project settings"
 *   subtitle="Manage team members, billing, and preferences."
 *   breadcrumbs={[
 *     { key: 'home', label: 'Home', href: '/' },
 *     { key: 'settings', label: 'Settings' },
 *   ]}
 *   actions={<Button>Save changes</Button>}
 * />
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('page-header', className)} data-page-header="">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav className="page-header__breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.key}>
                {crumb.href ? (
                  <a href={crumb.href}>{crumb.label}</a>
                ) : (
                  <span
                    aria-current={
                      index === breadcrumbs.length - 1 ? 'page' : undefined
                    }
                  >
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 ? (
                  <span aria-hidden="true"> / </span>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="page-header__row" data-slot="row">
        <div className="page-header__titles" data-slot="titles">
          <h1 className="page-header__title">{title}</h1>
          {subtitle ? (
            <p className="page-header__subtitle">{subtitle}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="page-header__actions" data-slot="actions">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
