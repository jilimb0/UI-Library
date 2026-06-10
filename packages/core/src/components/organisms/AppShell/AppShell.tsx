import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface AppShellProps {
  /** Sidebar content (typically a `<Sidebar>` component). */
  sidebar?: ReactNode;
  /** Top navigation bar (typically a `<TopNav>` component). */
  topNav?: ReactNode;
  /** Main content area. */
  children: ReactNode;
  /** Footer content (optional). */
  footer?: ReactNode;
  /** Additional class name for the root element. */
  className?: string;
}

/**
 * AppShell — top-level application layout.
 *
 * Composes a sidebar, top navigation bar, main content area, and optional
 * footer into a responsive application shell layout.
 *
 * @example
 * ```tsx
 * <AppShell
 *   sidebar={<Sidebar groups={navGroups} />}
 *   topNav={<TopNav brand="My App" />}
 * >
 *   <PageHeader title="Dashboard" />
 *   <DataTable data={rows} />
 * </AppShell>
 * ```
 */
export function AppShell({
  sidebar,
  topNav,
  children,
  footer,
  className,
}: AppShellProps) {
  return (
    <div className={cn('app-shell', className)} data-app-shell="">
      {topNav ? (
        <header className="app-shell__topnav" data-region="topnav">
          {topNav}
        </header>
      ) : null}

      <div className="app-shell__body" data-region="body">
        {sidebar ? (
          <aside className="app-shell__sidebar" data-region="sidebar">
            {sidebar}
          </aside>
        ) : null}

        <main className="app-shell__main" data-region="main">
          {children}
        </main>
      </div>

      {footer ? (
        <footer className="app-shell__footer" data-region="footer">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
