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
    <div
      className={cn(
        'grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-[280px_1fr]',
        className
      )}
    >
      {sidebar ? (
        <aside className="border-r border-slate-200 bg-white">{sidebar}</aside>
      ) : null}
      <div className="flex min-h-screen flex-col">
        {header ? (
          <header className="border-b border-slate-200 bg-white">
            {header}
          </header>
        ) : null}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
