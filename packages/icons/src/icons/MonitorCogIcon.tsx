import type { SVGProps } from 'react';

export function MonitorCogIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <path d="m17.5 8.5.5 1 .9.2-.7.7.2 1-.9-.5-.9.5.2-1-.7-.7.9-.2.5-1Z" />
    </svg>
  );
}
