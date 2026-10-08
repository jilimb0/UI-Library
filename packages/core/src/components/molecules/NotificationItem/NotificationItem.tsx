import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

export interface NotificationItemProps {
  id?: string;
  /** Main notification message or title. */
  title: ReactNode;
  /** Detailed message or context. */
  description?: ReactNode;
  /** Relative or formatted timestamp (e.g., "5m ago", "Just now"). */
  timestamp: string;
  /** Severity level influencing border and icon color. */
  severity?: NotificationSeverity;
  /** Whether the notification is unread (displays an accent dot). */
  unread?: boolean;
  /** Optional associated entity name (e.g., "RepoRadar / alerts"). */
  entityName?: string;
  /** Optional icon or avatar to display on the left. */
  avatar?: ReactNode;
  /** Click handler for opening the notification target. */
  onClick?: () => void;
  /** Action slot for inline actions (e.g. Dismiss, Mark as read). */
  actionSlot?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

function SeverityIndicator({ severity }: { severity: NotificationSeverity }) {
  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full ring-2 ring-background shrink-0',
        severity === 'error'
          ? 'bg-rose-500'
          : severity === 'warning'
            ? 'bg-amber-500'
            : severity === 'success'
              ? 'bg-emerald-500'
              : 'bg-[#6C7BFF]'
      )}
    />
  );
}

export function NotificationItem({
  title,
  description,
  timestamp,
  severity = 'info',
  unread = false,
  entityName,
  avatar,
  onClick,
  actionSlot,
  className,
}: NotificationItemProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'ucl-notification-item w-full flex items-start gap-3.5 p-4 rounded-xl text-left transition-all duration-150',
        'border border-[rgba(108,123,255,0.12)]',
        unread
          ? 'bg-[rgba(18,21,31,0.85)] border-[rgba(108,123,255,0.24)] shadow-sm'
          : 'bg-[rgba(18,21,31,0.5)] hover:bg-[rgba(18,21,31,0.7)]',
        onClick && 'cursor-pointer hover:border-[rgba(108,123,255,0.36)]',
        className
      )}
    >
      {/* Unread dot or Avatar */}
      <div className="relative shrink-0 mt-1 flex items-center justify-center">
        {avatar ?? <SeverityIndicator severity={severity} />}
        {unread && avatar && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#6C7BFF] ring-2 ring-background" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          {entityName && (
            <span className="text-xs font-semibold text-[#6C7BFF] uppercase tracking-wider truncate">
              {entityName}
            </span>
          )}
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto">
            {timestamp}
          </span>
        </div>

        <div className="text-sm font-medium text-foreground leading-snug">
          {title}
        </div>

        {description && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {/* Action Slot */}
      {actionSlot && (
        <div className="shrink-0 ml-2 self-center">{actionSlot}</div>
      )}
    </Component>
  );
}
