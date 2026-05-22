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
    <div className={cn('layout-shell', className)}>
      {navbar ? <header className="layout-header">{navbar}</header> : null}
      <main className="layout-main">{children}</main>
    </div>
  );
}
