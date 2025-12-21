
import * as React from 'react';

export function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth={2} />
      <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}
