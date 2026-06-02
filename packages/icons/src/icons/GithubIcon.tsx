import type { SVGProps } from 'react';

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 19c-4 1.5-4-2.5-6-3" />
      <path d="M15 21v-4a4 4 0 0 0-1.2-3c4-.5 7.2-2 7.2-7a5.4 5.4 0 0 0-1.5-3.7 5 5 0 0 0-.1-3.7s-1.2-.4-4 1.5a13.5 13.5 0 0 0-7 0C5.6-.8 4.4-.4 4.4-.4a5 5 0 0 0-.1 3.7A5.4 5.4 0 0 0 2.8 7c0 5 3.2 6.5 7.2 7a4 4 0 0 0-1.2 3v4" />
    </svg>
  );
}
