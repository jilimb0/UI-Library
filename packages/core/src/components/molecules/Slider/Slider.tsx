import {
  Range as SliderRange,
  Root as SliderRoot,
  Thumb as SliderThumb,
  Track as SliderTrack,
} from '@ui-construction-library/primitives';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export const sliderVariants = cva('slider', {
  variants: {
    size: {
      sm: 'slider--sm',
      md: 'slider--md',
      lg: 'slider--lg',
    },
    orientation: {
      horizontal: 'slider--horizontal',
      vertical: 'slider--vertical',
    },
  },
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
  },
});

export interface SliderProps extends VariantProps<typeof sliderVariants> {
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Slider({
  value,
  defaultValue = [0],
  onChange,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  size,
  orientation = 'horizontal',
  className,
  style,
}: SliderProps) {
  const resolvedValue = value ?? defaultValue;
  const handleValueChange = (nextValue: number[]) => {
    onValueChange?.(nextValue);
    onChange?.(nextValue);
  };

  return (
    <SliderRoot
      value={resolvedValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
      orientation={orientation ?? 'horizontal'}
      className={cn(sliderVariants({ size, orientation }), className)}
      style={style}
    >
      <SliderTrack className="slider__track">
        <SliderRange className="slider__range" />
      </SliderTrack>
      {resolvedValue.map((_, i) => (
        <SliderThumb
          // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are stable by index
          key={`thumb-${i}`}
          className="slider__thumb"
          aria-label={`Thumb ${i + 1}`}
        />
      ))}
    </SliderRoot>
  );
}
