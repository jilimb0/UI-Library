import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface StatCardProps {
  /** Primary label of the statistic (e.g., "Health Score", "Total Revenue"). */
  label: string;
  /** Primary metric value (e.g., "98.4%", "$14,250"). */
  value: string | number;
  /** Change delta over period (e.g., "+14%", "-2.5%"). */
  delta?: string | number;
  /** Explicit direction override for delta coloring. */
  deltaType?: 'increase' | 'decrease' | 'neutral';
  /** Explanatory tooltip or helper text. */
  tooltip?: string;
  /** Secondary descriptive text below the value. */
  subtext?: string;
  /** Optional icon displayed in top-right or top-left. */
  icon?: ReactNode;
  /** Card style variant. Defaults to 'glass' Dark Glassmorphism. */
  variant?: 'default' | 'glass' | 'success' | 'warning' | 'error';
  /** Optional click handler for interactive cards. */
  onClick?: () => void;
  /** Additional CSS class names. */
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  deltaType,
  tooltip,
  subtext,
  icon,
  variant = 'glass',
  onClick,
  className,
}: StatCardProps) {
  const Component = onClick ? 'button' : 'div';

  // Compute delta trend (positive = green, negative = red)
  const isPositive =
    deltaType === 'increase' ||
    (deltaType === undefined &&
      delta !== undefined &&
      (String(delta).startsWith('+') ||
        (typeof delta === 'number' && delta > 0)));

  const isNegative =
    deltaType === 'decrease' ||
    (deltaType === undefined &&
      delta !== undefined &&
      (String(delta).startsWith('-') ||
        (typeof delta === 'number' && delta < 0)));

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'ucl-stat-card relative flex flex-col justify-between p-6 rounded-2xl text-left transition-all duration-200',
        variant === 'glass'
          ? 'bg-[rgba(18,21,31,0.75)] backdrop-blur-[16px] border border-[rgba(108,123,255,0.12)] hover:border-[rgba(108,123,255,0.28)] shadow-sm'
          : variant !== 'default'
            ? `kpi-card--${variant}`
            : 'bg-card border border-border shadow-sm',
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          {label}
        </span>
        {icon ? (
          <div className="text-muted-foreground shrink-0">{icon}</div>
        ) : null}
      </div>

      <div className="flex items-baseline gap-3 my-1">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </span>

        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold',
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : isNegative
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            )}
            title={tooltip}
          >
            {isPositive && '↑'}
            {isNegative && '↓'}
            {delta}
          </span>
        )}
      </div>

      {(subtext || tooltip) && (
        <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
          {subtext && <span>{subtext}</span>}
          {tooltip && !subtext && <span>{tooltip}</span>}
        </div>
      )}
    </Component>
  );
}
