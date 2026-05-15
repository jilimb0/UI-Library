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
      className={cn(
        'grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]',
        className
      )}
    >
      <aside
        className={cn('border-r border-slate-200 bg-white', sidebarClassName)}
      >
        {sidebar}
      </aside>
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
