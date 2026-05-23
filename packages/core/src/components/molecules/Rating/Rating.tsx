import type { CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  icon?: 'star' | 'heart';
  allowHalf?: boolean;
  className?: string;
  style?: CSSProperties;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
}

export function Rating({
  value = 0,
  defaultValue = 0,
  max = 5,
  icon = 'star',
  allowHalf = false,
  className,
  style,
  onChange,
  onValueChange,
}: RatingProps) {
  const resolvedValue = value ?? defaultValue;
  const emitChange = (nextValue: number) => {
    onChange?.(nextValue);
    onValueChange?.(nextValue);
  };
  return (
    <div className={cn('rating', className)} style={style}>
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const active = resolvedValue >= index;
        const half = allowHalf && resolvedValue + 0.5 === index;
        return (
          <button
            key={index}
            type="button"
            onClick={() => emitChange(index)}
            className={cn(
              'rating__button',
              (active || half) && 'stepper__indicator--active'
            )}
            style={{
              background: 'transparent',
              border: 0,
              fontSize: '1.25rem',
              color: active || half ? 'var(--warning)' : 'var(--border)',
            }}
            aria-label={`Rate ${index}`}
          >
            {icon === 'heart' ? '♥' : '★'}
          </button>
        );
      })}
    </div>
  );
}
