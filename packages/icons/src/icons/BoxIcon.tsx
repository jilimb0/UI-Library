import type { SVGProps } from 'react';

export function BoxIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" />
      <path d="M12 11 5 7" />
      <path d="M12 11l7-4" />
      <path d="M12 11v10" />
    </svg>
  );
}
