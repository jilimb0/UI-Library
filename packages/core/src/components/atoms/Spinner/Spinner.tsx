import { forwardRef } from 'react';

export interface SpinnerProps {
  size?: number;
}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = 24, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        aria-label="Loading"
        role="img"
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner };
