import type { SVGProps } from 'react';

export function CommandIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 7h2v2H7z" />
      <path d="M15 7h2v2h-2z" />
      <path d="M7 15h2v2H7z" />
      <path d="M15 15h2v2h-2z" />
      <path d="M9 8h6" />
      <path d="M8 9v6" />
      <path d="M16 9v6" />
      <path d="M9 16h6" />
    </svg>
  );
}
