import type { SVGProps } from 'react';

export function AlertTriangleIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4 3.5 19h17L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
