import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  sidebarClassName?: string;
}

export function SidebarLayout({
  sidebar,
  children,
  className,
  sidebarClassName,
}: SidebarLayoutProps) {
  return (
    <div
      className={cn('layout-shell', className)}
      style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)' }}
    >
      <aside className={cn('layout-sidebar', sidebarClassName)}>
        {sidebar}
      </aside>
      <main className="layout-main">{children}</main>
    </div>
  );
}
