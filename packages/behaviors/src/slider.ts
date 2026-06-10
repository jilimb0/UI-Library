/**
 * Slider behavior — framework-agnostic range input state.
 */

export interface SliderBehaviorOptions {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function createSliderBehavior(opts: SliderBehaviorOptions) {
  const min = opts.min ?? 0;
  const max = opts.max ?? 100;
  const percent = ((opts.value - min) / (max - min)) * 100;

  return {
    thumbAttrs: {
      role: 'slider' as const,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': opts.value,
      'aria-orientation': 'horizontal' as const,
      disabled: opts.disabled,
    },
    rangeAttrs: {
      'data-orientation': 'horizontal' as const,
      style: { width: `${percent}%` },
    },
  };
}
