import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useEffect, useState, } from 'react';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';
const ContextMenuContext = createContext(null);
function useContextMenu() {
    const ctx = useContext(ContextMenuContext);
    if (!ctx)
        throw new Error('ContextMenu must be used within ContextMenu.Root');
    return ctx;
}
function Root({ open, defaultOpen, onOpenChange, children, }) {
    const [currentOpen, setOpen] = useControllableState({
        value: open,
        defaultValue: defaultOpen ?? false,
        onChange: onOpenChange,
    });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    return (_jsx(ContextMenuContext.Provider, { value: {
            open: Boolean(currentOpen),
            setOpen,
            position,
            setPosition,
        }, children: children }));
}
const Trigger = forwardRef(function Trigger({ asChild, onContextMenu, children, ...props }, ref) {
    const { setOpen, setPosition } = useContextMenu();
    return (_jsx(Slottable, { asChild: asChild, children: _jsx("div", { ref: ref, role: "presentation", onContextMenu: (e) => {
                onContextMenu?.(e);
                e.preventDefault();
                setPosition({ x: e.clientX, y: e.clientY });
                setOpen(true);
            }, ...props, children: children }) }));
});
function PortalWrapper({ children }) {
    const { open } = useContextMenu();
    if (!open)
        return null;
    return _jsx(Portal, { children: children });
}
const Content = forwardRef(function Content({ style, ...props }, ref) {
    const { setOpen, position } = useContextMenu();
    useEffect(() => {
        setTimeout(() => {
            const firstItem = document.querySelector('[role="menuitem"]');
            firstItem?.focus();
        }, 50);
    }, []);
    useEffect(() => {
        const close = () => setOpen(false);
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                return;
            }
            const items = Array.from(document.querySelectorAll('[role="menuitem"]'));
            if (items.length === 0)
                return;
            const currentIndex = items.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex]?.focus();
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex]?.focus();
            }
        };
        window.addEventListener('click', close);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('click', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [setOpen]);
    return (_jsx("div", { ref: ref, role: "menu", style: {
            position: 'fixed',
            top: position.y,
            left: position.x,
            zIndex: 50,
            ...style,
        }, onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), ...props }));
});
const Item = forwardRef(function Item({ onSelect, onClick, ...props }, ref) {
    const { setOpen } = useContextMenu();
    return (_jsx("div", { ref: ref, role: "menuitem", tabIndex: 0, onClick: (e) => {
            onClick?.(e);
            onSelect?.();
            setOpen(false);
        }, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.();
                setOpen(false);
            }
        }, ...props }));
});
export const ContextMenu = {
    Root,
    Trigger,
    Portal: PortalWrapper,
    Content,
    Item,
};
