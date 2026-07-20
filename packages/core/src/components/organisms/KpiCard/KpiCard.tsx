import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface KpiCardProps {
  /** Primary metric label. */
  label: string;
  /** The metric value to display. */
  value: string | number;
  /** Optional sub-text below the value (e.g., "vs last week"). */
  subtext?: string;
  /** Optional icon rendered above the label. */
  icon?: ReactNode;
  /** Visual accent variant for the left border. */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Whether the card is selected/active. */
  selected?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Additional class name. */
  className?: string;
}

export function KpiCard({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
  selected,
  onClick,
  className,
}: KpiCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      className={cn(
        'kpi-card',
        variant !== 'default' && `kpi-card--${variant}`,
        selected && 'kpi-card--selected',
        onClick && 'kpi-card--interactive',
        className
      )}
      onClick={onClick}
    >
      {icon ? <div className="kpi-card__icon">{icon}</div> : null}
      <div className="kpi-card__body">
        <span className="kpi-card__label">{label}</span>
        <span className="kpi-card__value">{value}</span>
        {subtext ? <span className="kpi-card__subtext">{subtext}</span> : null}
      </div>
    </Component>
  );
}
