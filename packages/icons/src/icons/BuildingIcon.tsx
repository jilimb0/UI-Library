import type { SVGProps } from 'react';

export function BuildingIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" />
      <path d="M8 8h2" />
      <path d="M12 8h2" />
      <path d="M8 12h2" />
      <path d="M12 12h2" />
      <path d="M10 21v-4h2v4" />
      <path d="M16 10h4v11h-4" />
    </svg>
  );
}
