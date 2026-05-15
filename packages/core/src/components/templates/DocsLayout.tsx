import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface DocsLayoutProps {
  navigation: ReactNode;
  children: ReactNode;
  toc?: ReactNode;
  className?: string;
}

export function DocsLayout({
  navigation,
  children,
  toc,
  className,
}: DocsLayoutProps) {
  return (
    <div
      className={cn(
        'grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_220px]',
        className
      )}
    >
      <aside className="border-r border-slate-200 bg-white p-4">
        {navigation}
      </aside>
      <main className="p-6">{children}</main>
      <aside className="hidden border-l border-slate-200 bg-white p-4 lg:block">
        {toc}
      </aside>
    </div>
  );
}
