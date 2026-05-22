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
    <div className="stack-vertical">
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          onChange?.(e.target.value);
        }}
        className="color-picker__input"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          onChange?.(e.target.value);
        }}
        className="input"
      />
      <div className="field-hint">
        rgb({rgb.r}, {rgb.g}, {rgb.b})
      </div>
    </div>
  );
}
