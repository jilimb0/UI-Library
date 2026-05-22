import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AuthLayoutProps {
  logo?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AuthLayout({
  logo,
  title,
  subtitle,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn('layout-auth', className)}>
      <div className="auth-card">
        {logo ? <div className="empty-state__action">{logo}</div> : null}
        {title ? <h1 className="empty-state__title">{title}</h1> : null}
        {subtitle ? (
          <p className="empty-state__description">{subtitle}</p>
        ) : null}
        <div className="form-stack">{children}</div>
      </div>
    </div>
  );
}
