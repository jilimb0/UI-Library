import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface DocsLayoutProps {
  sidebar?: ReactNode;
  toc?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DocsLayout({
  sidebar,
  toc,
  children,
  className,
}: DocsLayoutProps) {
  return (
    <div
      className={cn('layout-shell', className)}
      style={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(240px, 280px) minmax(0, 1fr) minmax(200px, 260px)',
      }}
    >
      <aside className="layout-sidebar">{sidebar}</aside>
      <main className="layout-main">{children}</main>
      <aside className="layout-sidebar">{toc}</aside>
    </div>
  );
}
