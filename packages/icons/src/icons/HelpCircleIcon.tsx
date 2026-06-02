import type { SVGProps } from 'react';

export function HelpCircleIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.7.7-1.8 1.3-1.8 2.8" />
      <path d="M12 17h.01" />
    </svg>
  );
}
