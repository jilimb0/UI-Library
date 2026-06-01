import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, } from 'react';
import { useControllableState } from './internal/useControllableState';
const SwitchContext = createContext(null);
const Root = forwardRef(function Root({ checked, defaultChecked, onCheckedChange, disabled, onClick, children, ...props }, ref) {
    const [current, setChecked] = useControllableState({
        value: checked,
        defaultValue: defaultChecked ?? false,
        onChange: onCheckedChange,
    });
    return (_jsx(SwitchContext.Provider, { value: { checked: Boolean(current), setChecked, disabled }, children: _jsx("button", { ref: ref, type: "button", role: "switch", "aria-checked": Boolean(current), "data-state": current ? 'checked' : 'unchecked', disabled: disabled, onClick: (e) => {
                onClick?.(e);
                if (!e.defaultPrevented && !disabled)
                    setChecked(!current);
            }, ...props, children: children }) }));
});
const Thumb = forwardRef(function Thumb(props, ref) {
    const ctx = useContext(SwitchContext);
    return (_jsx("span", { ref: ref, "data-state": ctx?.checked ? 'checked' : 'unchecked', ...props }));
});
export const Switch = { Root, Thumb };
