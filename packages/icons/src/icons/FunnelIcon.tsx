import type { SVGProps } from 'react';

export function FunnelIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 5h16l-6 7v6l-4 2v-8Z" />
    </svg>
  );
}
