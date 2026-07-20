import type { SVGProps } from 'react';

export function BitbucketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.5 4.5a1 1 0 0 1 1-1h17a1 1 0 0 1 1 1l-2 15a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" />
      <path d="M8.5 8.5h7l-1 7h-5z" opacity="0.5" />
    </svg>
  );
}
