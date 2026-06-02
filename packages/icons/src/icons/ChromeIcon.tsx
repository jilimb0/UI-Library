import type { SVGProps } from 'react';

export function ChromeIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3a9 9 0 0 1 7.8 4.5H12" />
      <path d="M4.2 7.5A9 9 0 0 0 12 21l3.9-6.8" />
      <path d="M19.8 7.5A9 9 0 0 1 12 21l-3.9-6.8" />
    </svg>
  );
}
