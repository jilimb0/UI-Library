import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface PageTipProps {
  /** Unique identifier for this tip (used for dismiss persistence). */
  id: string;
  /** Tip content. */
  children: ReactNode;
  /** Icon displayed before content. */
  icon?: ReactNode;
  /** Storage key prefix. @default 'ucl-pagetip' */
  storageKey?: string;
  /** Called when dismissed. */
  onDismiss?: (id: string) => void;
  /** Additional class name. */
  className?: string;
}

function isDismissed(storageKey: string, id: string): boolean {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return false;
    const dismissed = JSON.parse(stored) as string[];
    return Array.isArray(dismissed) && dismissed.includes(id);
  } catch {
    return false;
  }
}

function markDismissed(storageKey: string, id: string) {
  try {
    const stored = localStorage.getItem(storageKey);
    const dismissed: string[] = stored ? JSON.parse(stored) : [];
    if (!dismissed.includes(id)) {
      localStorage.setItem(storageKey, JSON.stringify([...dismissed, id]));
    }
  } catch {
    // localStorage may be unavailable
  }
}

export function PageTip({
  id,
  children,
  icon,
  storageKey = 'ucl-pagetip',
  onDismiss,
  className,
}: PageTipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isDismissed(storageKey, id));
  }, [storageKey, id]);

  if (!visible) return null;

  const handleDismiss = () => {
    markDismissed(storageKey, id);
    setVisible(false);
    onDismiss?.(id);
  };

  return (
    <div className={cn('page-tip', className)} role="status">
      {icon ? <span className="page-tip__icon">{icon}</span> : null}
      <div className="page-tip__body">{children}</div>
      <button
        type="button"
        className="page-tip__dismiss"
        aria-label="Dismiss tip"
        onClick={handleDismiss}
      >
        &times;
      </button>
    </div>
  );
}
