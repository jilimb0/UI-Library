import type { SVGProps } from 'react';

export function CpuIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M5 5l2 2" />
      <path d="M17 17l2 2" />
      <path d="M5 19l2-2" />
      <path d="M17 7l2-2" />
    </svg>
  );
}
