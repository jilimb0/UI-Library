import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useCallback, useContext, useRef, } from 'react';
import { useControllableState } from './internal/useControllableState';
const SliderContext = createContext(null);
const Root = forwardRef(function Root({ value, defaultValue = [0], onValueChange, min = 0, max = 100, step = 1, disabled, ...props }, ref) {
    const [current, setValue] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    const trackRef = useRef(null);
    return (_jsx(SliderContext.Provider, { value: {
            value: current ?? defaultValue,
            setValue,
            min,
            max,
            step,
            disabled,
            trackRef,
        }, children: _jsx("div", { ref: ref, "data-disabled": disabled ? '' : undefined, ...props }) }));
});
const Track = forwardRef(function Track(props, ref) {
    const ctx = useContext(SliderContext);
    return (_jsx("div", { ref: (node) => {
            if (ctx)
                ctx.trackRef.current = node;
            if (typeof ref === 'function')
                ref(node);
            else if (ref)
                ref.current = node;
        }, ...props }));
});
const Range = forwardRef(function Range(props, ref) {
    const ctx = useContext(SliderContext);
    if (!ctx)
        return _jsx("div", { ref: ref, ...props });
    const [val] = ctx.value;
    const percent = ((val - ctx.min) / (ctx.max - ctx.min)) * 100;
    return (_jsx("div", { ref: ref, style: { width: `${percent}%` }, "data-orientation": "horizontal", ...props }));
});
const Thumb = forwardRef(function Thumb({ className, style, ...props }, ref) {
    const ctx = useContext(SliderContext);
    const onPointerDown = useCallback((event) => {
        if (!ctx?.trackRef.current || ctx.disabled)
            return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const update = (clientX) => {
            const rect = ctx.trackRef.current?.getBoundingClientRect();
            if (!rect)
                return;
            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            const raw = ctx.min + ratio * (ctx.max - ctx.min);
            const stepped = Math.round(raw / ctx.step) * ctx.step;
            ctx.setValue([stepped]);
        };
        update(event.clientX);
        const onMove = (e) => update(e.clientX);
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }, [ctx]);
    if (!ctx) {
        return (_jsx("button", { ref: ref, type: "button", role: "slider", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0, "aria-orientation": "horizontal", ...props }));
    }
    const [val] = ctx.value;
    return (_jsx("button", { ref: ref, type: "button", role: "slider", "aria-valuemin": ctx.min, "aria-valuemax": ctx.max, "aria-valuenow": val, "aria-orientation": "horizontal", disabled: ctx.disabled, onPointerDown: onPointerDown, className: className, style: style, ...props }));
});
export const Slider = { Root, Track, Range, Thumb };
