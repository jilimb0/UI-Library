import type { SVGProps } from 'react';

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 3 6 5v5c0 5 3.5 8.5 6 10 2.5-1.5 6-5 6-10V5l-6-2Z" />
    </svg>
  );
}
