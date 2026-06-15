import { createSliderBehavior } from '@ui-construction-library/behaviors';
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { assignRef } from './internal/helpers/assignRef';
import { normalizeAriaOrientation } from './internal/helpers/normalizeAria';
import { useControllableState } from './internal/useControllableState';

type SliderContextValue = {
  value: number[];
  setValue: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  trackRef: { current: HTMLDivElement | null };
  orientation: 'horizontal' | 'vertical';
};

const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext() {
  const ctx = useContext(SliderContext);
  if (!ctx)
    throw new Error('Slider components must be used within Slider.Root');
  return ctx;
}

/**
 * Slider primitive - a control for selecting a value from a range.
 *
 * @example
 * ```tsx
 * <Slider.Root min={0} max={100} step={1} defaultValue={[50]}>
 *   <Slider.Track>
 *     <Slider.Range />
 *   </Slider.Track>
 *   <SliderThumb aria-label="Volume" />
 * </Slider.Root>
 * ```
 */
export type SliderRootProps = HTMLAttributes<HTMLDivElement> & {
  /** Initial value (controlled) */
  value?: number[];
  /** Initial value (uncontrolled) */
  defaultValue?: number[];
  /** Callback when value changes */
  onValueChange?: (value: number[]) => void;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Disable the slider */
  disabled?: boolean;
  /** Orientation: 'horizontal' (default) or 'vertical' */
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Slider.Root - The container component that provides context and state.
 */
const Root = forwardRef<HTMLDivElement, SliderRootProps>(function Root(
  {
    value,
    defaultValue = [0],
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    orientation = 'horizontal',
    ...props
  },
  ref
) {
  const [current, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <SliderContext.Provider
      value={{
        value: current ?? defaultValue,
        setValue,
        min,
        max,
        step,
        disabled,
        trackRef,
        orientation,
      }}
    >
      <div
        ref={ref}
        data-disabled={disabled ? '' : undefined}
        data-orientation={orientation}
        {...props}
      />
    </SliderContext.Provider>
  );
});

/**
 * Slider.Track - The track container that holds the range.
 */
const Track = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Track(props, ref) {
    const ctx = useContext(SliderContext);
    return (
      <div
        ref={(node) => {
          if (ctx) ctx.trackRef.current = node;
          assignRef(ref, node);
        }}
        {...props}
      />
    );
  }
);

/**
 * Slider.Range - The filled range indicator showing selected value.
 */
const Range = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Range(props, ref) {
    const ctx = useContext(SliderContext);
    if (!ctx) return <div ref={ref} {...props} />;
    const [val] = ctx.value;
    const behavior = createSliderBehavior({
      value: val,
      min: ctx.min,
      max: ctx.max,
    });

    return <div ref={ref} {...behavior.rangeAttrs} {...props} />;
  }
);

/**
 * Slider.Thumb - The draggable control for adjusting the value.
 *
 * Supports:
 * - Pointer drag (mouse/touch)
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Both horizontal and vertical orientations
 */
const Thumb = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Thumb(
  { className, style, onPointerDown, onKeyDown, ...props },
  ref
) {
  const ctx = useSliderContext();

  const onPointerDownInternal = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;

      const startX = event.clientX;
      const startY = event.clientY;
      const startValue = ctx.value[0];

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.buttons === 0) return;
        const delta =
          ctx.orientation === 'horizontal'
            ? moveEvent.clientX - startX
            : moveEvent.clientY - startY;
        const nextValue = Math.min(
          ctx.max,
          Math.max(ctx.min, startValue + delta)
        );
        ctx.setValue([nextValue]);
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [ctx, onPointerDown]
  );

  const onKeyboardDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const step = ctx.step;
      let nextValue = ctx.value[0];

      switch (event.key) {
        case 'ArrowLeft':
          if (ctx.orientation === 'horizontal') {
            nextValue = nextValue - step;
          }
          break;
        case 'ArrowRight':
          if (ctx.orientation === 'horizontal') {
            nextValue = nextValue + step;
          }
          break;
        case 'ArrowDown':
          if (ctx.orientation === 'vertical') {
            nextValue = nextValue - step;
          } else {
            nextValue = nextValue - step;
          }
          break;
        case 'ArrowUp':
          if (ctx.orientation === 'vertical') {
            nextValue = nextValue + step;
          } else {
            nextValue = nextValue + step;
          }
          break;
        case 'Home':
          nextValue = ctx.min;
          break;
        case 'End':
          nextValue = ctx.max;
          break;
        default:
          return;
      }

      nextValue = Math.min(ctx.max, Math.max(ctx.min, nextValue));
      ctx.setValue([nextValue]);
      event.preventDefault();
    },
    [ctx, onKeyDown]
  );

  if (!ctx) {
    const fallback = createSliderBehavior({ value: 0 });
    const fallbackProps = {
      ...fallback.thumbAttrs,
      'aria-orientation': normalizeAriaOrientation(
        fallback.thumbAttrs['aria-orientation']
      ),
      type: 'button' as const,
      ...props,
    } satisfies React.ButtonHTMLAttributes<HTMLButtonElement>;

    return <button {...fallbackProps} ref={ref} />;
  }

  const [val] = ctx.value;
  const behavior = createSliderBehavior({
    value: val,
    min: ctx.min,
    max: ctx.max,
    step: ctx.step,
    disabled: ctx.disabled,
    orientation: ctx.orientation,
  });

  const buttonProps = {
    ...behavior.thumbAttrs,
    'aria-orientation': normalizeAriaOrientation(
      behavior.thumbAttrs['aria-orientation']
    ),
    type: 'button' as const,
    disabled: ctx.disabled,
    onPointerDown: onPointerDownInternal,
    onKeyDown: onKeyboardDown,
    className,
    style,
    ...props,
  } satisfies React.ButtonHTMLAttributes<HTMLButtonElement>;

  return <button {...buttonProps} ref={ref} />;
});

export { Range, Root, Thumb, Track };
