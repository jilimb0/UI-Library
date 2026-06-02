import type { SVGProps } from 'react';

export function ColumnsIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4v16" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
