import { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface ProgressProps {
  value: number;
  /** Accessible label for the progress bar. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, label, className, style }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        className={cn('progress', className)}
        style={style}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={label}
      >
        <div className="progress__bar" style={{ width: `${clamped}%` }} />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
