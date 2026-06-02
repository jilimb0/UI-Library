import type { SVGProps } from 'react';

export function BugIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 9a3 3 0 1 1 6 0" />
      <path d="M12 9v10" />
      <path d="M7 13h10" />
      <path d="M8 6 6 4" />
      <path d="M16 6l2-2" />
      <path d="M7 17l-2 2" />
      <path d="M17 17l2 2" />
      <path d="M4 10h4" />
      <path d="M16 10h4" />
    </svg>
  );
}
