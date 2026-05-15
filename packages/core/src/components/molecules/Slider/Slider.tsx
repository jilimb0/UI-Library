import * as RadixSlider from '@radix-ui/react-slider';

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
    <RadixSlider.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className="relative flex h-5 w-full items-center"
    >
      <RadixSlider.Track className="relative h-1 w-full rounded-full bg-slate-200">
        <RadixSlider.Range className="absolute h-full rounded-full bg-blue-500" />
      </RadixSlider.Track>
      {thumbKeys.map((thumbKey, i) => (
        <RadixSlider.Thumb
          key={thumbKey}
          className="block h-4 w-4 rounded-full border border-blue-500 bg-white shadow"
          aria-label={`Thumb ${i + 1}`}
        />
      ))}
    </RadixSlider.Root>
  );
}
