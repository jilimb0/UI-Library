import type { SVGProps } from 'react';

export function GitPullRequestIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 6h8" />
      <path d="M18 8v8" />
      <path d="M6 8v10a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
