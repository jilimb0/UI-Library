import { createSliderBehavior } from '@ui-construction-library/behaviors';
import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type Ref,
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

  const _behavior = createSliderBehavior({
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
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
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
  ButtonHTMLAttributes<HTMLButtonElement>
>(function Thumb({ className, style, ...props }, ref) {
  const ctx = useContext(SliderContext);
  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!ctx?.trackRef.current || ctx.disabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);

      const update = (clientX: number) => {
        const rect = ctx.trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = Math.min(
          1,
          Math.max(0, (clientX - rect.left) / rect.width)
        );
        const raw = ctx.min + ratio * (ctx.max - ctx.min);
        const stepped = Math.round(raw / ctx.step) * ctx.step;
        ctx.setValue([stepped]);
      };

      update(event.clientX);

      const onMove = (e: globalThis.PointerEvent) => update(e.clientX);
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [ctx]
  );

  if (!ctx) {
    const fallback = createSliderBehavior({ value: 0 });
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        {...fallback.thumbAttrs}
        {...props}
      />
    );
  }
  const [val] = ctx.value;
  const behavior = createSliderBehavior({
    value: val,
    min: ctx.min,
    max: ctx.max,
    step: ctx.step,
    disabled: ctx.disabled,
  });

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      {...behavior.thumbAttrs}
      disabled={ctx.disabled}
      onPointerDown={onPointerDown}
      className={className}
      style={style}
      {...props}
    />
  );
});

export const Slider = { Root, Track, Range, Thumb };
