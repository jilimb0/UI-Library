import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  style,
}: EmptyStateProps) {
  return (
    <div className={cn('empty-state', className)} style={style} role="status">
      {icon ? <div className="empty-state__icon">{icon}</div> : null}
      <h3 className="empty-state__title">{title}</h3>
      {description ? (
        <p className="empty-state__description">{description}</p>
      ) : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
