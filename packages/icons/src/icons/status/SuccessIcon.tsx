
import * as React from 'react';

export function SuccessIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}
