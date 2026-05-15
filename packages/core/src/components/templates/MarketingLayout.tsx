import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface MarketingLayoutProps {
  header?: ReactNode;
  hero?: ReactNode;
  sections?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function MarketingLayout({
  header,
  hero,
  sections,
  footer,
  children,
  className,
}: MarketingLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-white text-slate-900', className)}>
      {header ? (
        <header className="border-b border-slate-100">{header}</header>
      ) : null}
      {hero ? <section>{hero}</section> : null}
      {sections ? <section>{sections}</section> : null}
      {children ? <section>{children}</section> : null}
      {footer ? (
        <footer className="border-t border-slate-100">{footer}</footer>
      ) : null}
    </div>
  );
}
