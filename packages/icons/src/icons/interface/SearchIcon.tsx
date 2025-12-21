
import * as React from 'react';

export function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}
