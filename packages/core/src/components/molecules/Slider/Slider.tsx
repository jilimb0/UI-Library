import {
  Range as SliderRange,
  Root as SliderRoot,
  Thumb as SliderThumb,
  Track as SliderTrack,
} from '@ui-construction-library/primitives';

export interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
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
  orientation = 'horizontal',
  className,
  style,
}: SliderProps) {
  const resolvedValue = value ?? defaultValue;
  const thumbKeys = resolvedValue.map((_, i) => `thumb-${i}`);
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
      orientation={orientation}
      className={className ?? 'slider'}
      style={style}
    >
      <SliderTrack className="slider__track">
        <SliderRange className="slider__range" />
      </SliderTrack>
      {thumbKeys.map((thumbKey, i) => (
        <SliderThumb
          key={thumbKey}
          className="slider__thumb"
          aria-label={`Thumb ${i + 1}`}
        />
      ))}
    </SliderRoot>
  );
}
