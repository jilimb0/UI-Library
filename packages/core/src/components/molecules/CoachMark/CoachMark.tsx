import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface CoachMarkProps {
  /** Unique identifier for this coach mark (used for dismiss persistence). */
  id: string;
  /** Content to display. */
  children: ReactNode;
  /** Title displayed above content. */
  title?: string;
  /** Label for the dismiss button. @default 'Got it' */
  dismissLabel?: string;
  /** Storage key prefix. @default 'ucl-coachmark' */
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
    // localStorage may be unavailable — silently ignore
  }
}

export function CoachMark({
  id,
  children,
  title,
  dismissLabel = 'Got it',
  storageKey = 'ucl-coachmark',
  onDismiss,
  className,
}: CoachMarkProps) {
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
    <div className={cn('coach-mark', className)} role="status">
      <div className="coach-mark__content">
        {title ? <p className="coach-mark__title">{title}</p> : null}
        <div className="coach-mark__body">{children}</div>
      </div>
      <button
        type="button"
        className="coach-mark__dismiss"
        onClick={handleDismiss}
      >
        {dismissLabel}
      </button>
    </div>
  );
}
