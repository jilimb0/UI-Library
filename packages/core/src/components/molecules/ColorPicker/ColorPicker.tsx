import { useMemo, useState } from 'react';

export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const v =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = Number.parseInt(v, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function ColorPicker({ value = '#3b82f6', onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const rgb = useMemo(() => hexToRgb(color), [color]);

  return (
    <div className="space-y-2">
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          onChange?.(e.target.value);
        }}
        className="h-10 w-16 cursor-pointer rounded border border-slate-300"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          onChange?.(e.target.value);
        }}
        className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
      />
      <div className="text-xs text-slate-600">
        rgb({rgb.r}, {rgb.g}, {rgb.b})
      </div>
    </div>
  );
}
