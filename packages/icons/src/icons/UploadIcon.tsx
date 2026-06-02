import type { SVGProps } from 'react';

export function UploadIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 20V10" />
      <path d="m7 13 5-5 5 5" />
      <path d="M5 4h14" />
    </svg>
  );
}
