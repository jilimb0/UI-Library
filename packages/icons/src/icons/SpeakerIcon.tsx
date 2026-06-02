import type { SVGProps } from 'react';

export function SpeakerIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="7" y="5" width="10" height="14" rx="2" />
      <circle cx="12" cy="14" r="2" />
      <path d="M12 8h.01" />
    </svg>
  );
}
