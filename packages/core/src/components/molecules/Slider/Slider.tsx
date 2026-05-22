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
      className="relative flex h-5 w-full items-center"
    >
      <PrimitiveSlider.Track className="relative h-1 w-full rounded-full bg-slate-200">
        <PrimitiveSlider.Range className="absolute h-full rounded-full bg-blue-500" />
      </PrimitiveSlider.Track>
      {thumbKeys.map((thumbKey, i) => (
        <PrimitiveSlider.Thumb
          key={thumbKey}
          className="block h-4 w-4 rounded-full border border-blue-500 bg-white shadow"
          aria-label={`Thumb ${i + 1}`}
        />
      ))}
    </PrimitiveSlider.Root>
  );
}
