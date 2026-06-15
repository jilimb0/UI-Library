/**
 * Slider behavior — framework-agnostic range input state + className + handlers.
 */

export interface SliderBehaviorOptions {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: number) => void;
}

export function createSliderBehavior(opts: SliderBehaviorOptions) {
  const min = opts.min ?? 0;
  const max = opts.max ?? 100;
  const step = opts.step ?? 1;
  const percent = ((opts.value - min) / (max - min)) * 100;
  const disabled = opts.disabled || false;
  const orientation = opts.orientation ?? 'horizontal';

  return {
    thumbAttrs: {
      role: 'slider' as const,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': opts.value,
      'aria-orientation': orientation,
      'aria-disabled': disabled || undefined,
      'data-disabled': disabled || undefined,
      tabIndex: disabled ? -1 : 0,
    },
    thumbClassName: 'ucl-slider-thumb',
    rangeAttrs: {
      'data-orientation': orientation,
      style: { width: `${percent}%` },
    },
    rangeClassName: 'ucl-slider-range',
    trackAttrs: {
      'data-orientation': orientation,
    },
    trackClassName: 'ucl-slider-track',
    handlers: {
      onKeyDown: (e: KeyboardEvent) => {
        if (disabled) return;
        let nextValue = opts.value;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            nextValue = Math.min(max, opts.value + step);
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            nextValue = Math.max(min, opts.value - step);
            break;
          case 'Home':
            e.preventDefault();
            nextValue = min;
            break;
          case 'End':
            e.preventDefault();
            nextValue = max;
            break;
          case 'PageUp':
            e.preventDefault();
            nextValue = Math.min(max, opts.value + step * 10);
            break;
          case 'PageDown':
            e.preventDefault();
            nextValue = Math.max(min, opts.value - step * 10);
            break;
        }
        if (nextValue !== opts.value) {
          opts.onChange?.(nextValue);
        }
      },
    },
  };
}
