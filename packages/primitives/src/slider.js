import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useCallback, useContext, useRef, } from 'react';
import { useControllableState } from './internal/useControllableState';
const SliderContext = createContext(null);
const Root = forwardRef(function Root({ value, defaultValue = [0], onValueChange, min = 0, max = 100, step = 1, disabled, orientation = 'horizontal', ...props }, ref) {
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
            orientation,
        }, children: _jsx("div", { ref: ref, "data-disabled": disabled ? '' : undefined, "data-orientation": orientation, ...props }) }));
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
    return (_jsx("div", { ref: ref, "data-orientation": ctx.orientation, ...props, style: {
            ...(props.style || {}),
            ...(ctx.orientation === 'horizontal'
                ? { width: `${((val - ctx.min) / (ctx.max - ctx.min)) * 100}%` }
                : { height: `${((val - ctx.min) / (ctx.max - ctx.min)) * 100}%` }),
        } }));
});
const Thumb = forwardRef(function Thumb({ className, style, onPointerDown, onKeyDown, ...props }, ref) {
    const ctx = useContext(SliderContext);
    const onPointerDownInternal = useCallback((event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || !ctx?.trackRef.current || ctx.disabled)
            return;
        const rect = ctx.trackRef.current.getBoundingClientRect();
        const startValue = ctx.value[0];
        const startPos = ctx.orientation === 'horizontal' ? event.clientX : event.clientY;
        const update = (pos) => {
            const ratio = Math.min(1, Math.max(0, ctx.orientation === 'horizontal'
                ? (pos - rect.left) / rect.width
                : (pos - rect.top) / rect.height));
            const raw = ctx.min + ratio * (ctx.max - ctx.min);
            const stepped = Math.round(raw / ctx.step) * ctx.step;
            ctx.setValue([stepped]);
        };
        update(startPos);
        const onMove = (e) => update(ctx.orientation === 'horizontal' ? e.clientX : e.clientY);
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }, [ctx, onPointerDown]);
    const onKeyboardDown = useCallback((event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !ctx)
            return;
        let nextValue = ctx.value[0];
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                nextValue -= ctx.step;
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                nextValue += ctx.step;
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
        ctx.setValue([Math.min(ctx.max, Math.max(ctx.min, nextValue))]);
        event.preventDefault();
    }, [ctx, onKeyDown]);
    if (!ctx) {
        return (_jsx("button", { ref: ref, type: "button", role: "slider", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0, "aria-orientation": "horizontal", ...props }));
    }
    const [val] = ctx.value;
    return (_jsx("button", { ref: ref, type: "button", role: "slider", "aria-valuemin": ctx.min, "aria-valuemax": ctx.max, "aria-valuenow": val, "aria-orientation": ctx.orientation, disabled: ctx.disabled, onPointerDown: onPointerDownInternal, onKeyDown: onKeyboardDown, className: className, style: style, ...props }));
});
export { Range, Root, Thumb, Track };

