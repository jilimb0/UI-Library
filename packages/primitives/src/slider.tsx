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
import { useControllableState } from './internal/useControllableState';

type SliderContextValue = {
  value: number[];
  setValue: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  trackRef: { current: HTMLDivElement | null };
};

const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext() {
  const ctx = useContext(SliderContext);
  if (!ctx)
    throw new Error('Slider components must be used within Slider.Root');
  return ctx;
}

export type SliderRootProps = HTMLAttributes<HTMLDivElement> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

const Root = forwardRef<HTMLDivElement, SliderRootProps>(function Root(
  {
    value,
    defaultValue = [0],
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
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

  createSliderBehavior({
    value: (current ?? defaultValue)[0],
    min,
    max,
    step,
    disabled,
  });

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
      }}
    >
      <div ref={ref} data-disabled={disabled ? '' : undefined} {...props} />
    </SliderContext.Provider>
  );
});

const Track = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Track(props, ref) {
    const ctx = useContext(SliderContext);
    return (
      <div
        ref={(node) => {
          if (ctx) ctx.trackRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref && node) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
        }}
        {...props}
      />
    );
  }
);

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

const Thumb = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Thumb({ className, style, onPointerDown, ...props }, ref) {
  const ctx = useSliderContext();

  const onPointerDownInternal = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;

      const startX = event.clientX;
      const startValue = ctx.value[0];

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.buttons === 0) return;
        const delta = moveEvent.clientX - startX;
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

  if (!ctx) {
    const fallback = createSliderBehavior({ value: 0 });
    // Normalize aria-orientation to match React's expected type
    const normalizedThumbAttrs = {
      ...fallback.thumbAttrs,
      'aria-orientation': fallback.thumbAttrs['aria-orientation'] as
        | 'horizontal'
        | 'vertical'
        | undefined,
    };
    const fallbackProps = {
      ...normalizedThumbAttrs,
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
  });

  // Normalize aria-orientation to match React's expected type
  const normalizedThumbAttrs = {
    ...behavior.thumbAttrs,
    'aria-orientation': behavior.thumbAttrs['aria-orientation'] as
      | 'horizontal'
      | 'vertical'
      | undefined,
  };

  const buttonProps = {
    ...normalizedThumbAttrs,
    type: 'button' as const,
    disabled: ctx.disabled,
    onPointerDown: onPointerDownInternal,
    className,
    style,
    ...props,
  } satisfies React.ButtonHTMLAttributes<HTMLButtonElement>;

  return <button {...buttonProps} ref={ref} />;
});

export { Range, Root, Thumb, Track };

// Namespace export for Slider with subcomponents
export const Slider = {
  Root,
  Track,
  Range,
  Thumb,
};
