import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface StackedLayoutProps {
  navbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function StackedLayout({
  navbar,
  children,
  className,
}: StackedLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-slate-50', className)}>
      {navbar ? (
        <header className="border-b border-slate-200 bg-white">{navbar}</header>
      ) : null}
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
