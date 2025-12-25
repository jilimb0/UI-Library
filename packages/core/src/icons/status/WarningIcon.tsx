
import * as React from 'react';

export function WarningIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth={2} />
      <path d="M12 8v4" stroke="#F59E0B" strokeWidth={2} />
      <circle cx="12" cy="16" r="1" fill="#F59E0B" />
    </svg>
  );
}
