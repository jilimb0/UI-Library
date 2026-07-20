import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface MarketingLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function MarketingLayout({
  header,
  footer,
  children,
  className,
}: MarketingLayoutProps) {
  return (
    <div className={cn('layout-shell', className)}>
      {header ? <header className="layout-header">{header}</header> : null}
      <main className="layout-main">{children}</main>
      {footer ? <footer className="layout-footer">{footer}</footer> : null}
    </div>
  );
}
