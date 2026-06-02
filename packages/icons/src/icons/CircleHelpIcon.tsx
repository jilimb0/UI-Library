import type { SVGProps } from 'react';

export function CircleHelpIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}
