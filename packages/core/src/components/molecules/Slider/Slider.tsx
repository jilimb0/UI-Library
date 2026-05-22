import { Slider as PrimitiveSlider } from '@ui-construction-library/primitives';

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}: SliderProps) {
  const thumbKeys = value.map((_, i) => `thumb-${i}`);

  return (
    <PrimitiveSlider.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className="slider"
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
