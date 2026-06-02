import type { SVGProps } from 'react';

export function SmartphoneIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 6h2" />
      <path d="M12 17h.01" />
    </svg>
  );
}
