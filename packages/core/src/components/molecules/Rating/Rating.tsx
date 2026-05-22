import { cn } from '../../../utils/cn';

export interface RatingProps {
  value: number;
  max?: number;
  icon?: 'star' | 'heart';
  allowHalf?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({
  value,
  max = 5,
  icon = 'star',
  allowHalf = false,
  onChange,
}: RatingProps) {
  return (
    <div className="rating">
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const active = value >= index;
        const half = allowHalf && value + 0.5 === index;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange?.(index)}
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
