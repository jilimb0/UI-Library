import type { SVGProps } from 'react';

export function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 10 11 19l-8-8V4h7l10 10Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}
