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
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-slate-100 p-4',
        className
      )}
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {logo ? <div className="mb-4 flex justify-center">{logo}</div> : null}
        {title ? (
          <h1 className="text-center text-2xl font-semibold text-slate-900">
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p className="mt-2 text-center text-sm text-slate-600">{subtitle}</p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
