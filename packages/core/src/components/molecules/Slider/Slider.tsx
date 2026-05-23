import { Slider as PrimitiveSlider } from '@ui-construction-library/primitives';

export interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  defaultValue = [0],
  onChange,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: SliderProps) {
  const resolvedValue = value ?? defaultValue;
  const thumbKeys = resolvedValue.map((_, i) => `thumb-${i}`);
  const handleValueChange = (nextValue: number[]) => {
    onValueChange?.(nextValue);
    onChange?.(nextValue);
  };

  return (
    <PrimitiveSlider.Root
      value={resolvedValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
      className={className ?? 'slider'}
    >
      <PrimitiveSlider.Track className="slider__track">
        <PrimitiveSlider.Range className="slider__range" />
      </PrimitiveSlider.Track>
      {thumbKeys.map((thumbKey, i) => (
        <PrimitiveSlider.Thumb
          key={thumbKey}
          className="slider__thumb"
          aria-label={`Thumb ${i + 1}`}
        />
      ))}
    </PrimitiveSlider.Root>
  );
}
