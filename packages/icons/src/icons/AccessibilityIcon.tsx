import type { SVGProps } from 'react';

export function AccessibilityIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6" />
      <path d="M9 21l3-6 3 6" />
      <path d="M6 11h12" />
    </svg>
  );
}
