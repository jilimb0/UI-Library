import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, } from 'react';
import { useControllableState } from './internal/useControllableState';
const TabsContext = createContext(null);
function useTabsContext() {
    const ctx = useContext(TabsContext);
    if (!ctx)
        throw new Error('Tabs components must be used within Tabs.Root');
    return ctx;
}
function Root({ value, defaultValue = '', onValueChange, children, }) {
    const [current, setValue] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    return (_jsx(TabsContext.Provider, { value: { value: current ?? defaultValue, setValue }, children: children }));
}
const List = forwardRef(function List(props, ref) {
    return _jsx("div", { ref: ref, role: "tablist", ...props });
});
const Trigger = forwardRef(function Trigger({ value: tabValue, ...props }, ref) {
    const { value, setValue } = useTabsContext();
    const active = value === tabValue;
    return (_jsx("button", { ref: ref, type: "button", role: "tab", "aria-selected": active, "data-state": active ? 'active' : 'inactive', onClick: () => setValue(tabValue), ...props }));
});
const Content = forwardRef(function Content({ value: tabValue, hidden, ...props }, ref) {
    const { value } = useTabsContext();
    const active = value === tabValue;
    return (_jsx("div", { ref: ref, role: "tabpanel", hidden: !active || hidden, "data-state": active ? 'active' : 'inactive', ...props }));
});
export const Tabs = { Root, List, Trigger, Content };
