import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useState, } from 'react';
const AccordionContext = createContext(null);
function Root({ type = 'single', collapsible = false, defaultValue, children, ...props }) {
    const initial = new Set(Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
            ? [defaultValue]
            : []);
    const [openItems, setOpenItems] = useState(initial);
    const toggle = (itemValue) => {
        setOpenItems((prev) => {
            const next = new Set(prev);
            if (type === 'multiple') {
                if (next.has(itemValue))
                    next.delete(itemValue);
                else
                    next.add(itemValue);
            }
            else if (next.has(itemValue) && collapsible) {
                next.delete(itemValue);
            }
            else {
                next.clear();
                next.add(itemValue);
            }
            return next;
        });
    };
    return (_jsx(AccordionContext.Provider, { value: { type, openItems, toggle, collapsible }, children: _jsx("div", { ...props, children: children }) }));
}
const ItemContext = createContext('');
const Item = forwardRef(function Item({ value, children, ...props }, ref) {
    return (_jsx(ItemContext.Provider, { value: value, children: _jsx("div", { ref: ref, "data-value": value, ...props, children: children }) }));
});
const Header = forwardRef(function Header(props, ref) {
    return _jsx("h3", { ref: ref, ...props });
});
const Trigger = forwardRef(function Trigger({ value, onClick, ...props }, ref) {
    const ctx = useContext(AccordionContext);
    const itemCtx = useContext(ItemContext);
    const itemValue = value ?? itemCtx ?? '';
    const open = ctx?.openItems.has(itemValue) ?? false;
    return (_jsx("button", { ref: ref, type: "button", "aria-expanded": open, "data-state": open ? 'open' : 'closed', onClick: (e) => {
            onClick?.(e);
            if (itemValue)
                ctx?.toggle(itemValue);
        }, ...props }));
});
const Content = forwardRef(function Content({ value, children, ...props }, ref) {
    const ctx = useContext(AccordionContext);
    const itemCtx = useContext(ItemContext);
    const itemValue = value ?? itemCtx ?? '';
    const open = ctx?.openItems.has(itemValue) ?? false;
    if (!open)
        return null;
    return (_jsx("section", { ref: ref, "data-state": "open", ...props, children: children }));
});
export const Accordion = { Root, Item, Trigger, Header, Content };
