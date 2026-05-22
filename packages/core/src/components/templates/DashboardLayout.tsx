import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface DashboardLayoutProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({
  sidebar,
  header,
  children,
  className,
}: DashboardLayoutProps) {
  return (
    <div className={cn('layout-shell', className)} style={{ display: 'flex' }}>
      {sidebar ? <aside className="layout-sidebar">{sidebar}</aside> : null}
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        {header ? <header className="layout-header">{header}</header> : null}
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
}
