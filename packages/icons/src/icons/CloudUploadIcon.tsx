import type { SVGProps } from 'react';

export function CloudUploadIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 19h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 10.5 3.5 3.5 0 0 0 7 19Z" />
      <path d="m12 15-3-3" />
      <path d="m12 15 3-3" />
      <path d="M12 9v6" />
    </svg>
  );
}
