import type { SVGProps } from 'react';

export function NewspaperIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 5h14v14H5Z" />
      <path d="M8 9h8" />
      <path d="M8 13h3" />
      <path d="M13 13h3" />
      <path d="M8 17h8" />
    </svg>
  );
}
