import type { SVGProps } from 'react';

export function GitlabIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m12 4 2.2 5.5h-4.4L12 4Z" />
      <path d="m4 9.5 3.1 10.5L12 9.5H4Z" />
      <path d="m20 9.5-3.1 10.5L12 9.5h8Z" />
      <path d="m7.1 20 4.9-10.5L16.9 20" />
    </svg>
  );
}
