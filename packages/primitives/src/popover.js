import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useEffect, useRef, useState, } from 'react';
import { trapFocus } from './internal/focusTrap';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';
const PopoverContext = createContext(null);
function usePopoverContext() {
    const ctx = useContext(PopoverContext);
    if (!ctx)
        throw new Error('Popover components must be used within Popover.Root');
    return ctx;
}
function Root({ open, defaultOpen, onOpenChange, modal = false, children, }) {
    const [currentOpen, setOpen] = useControllableState({
        value: open,
        defaultValue: defaultOpen ?? false,
        onChange: onOpenChange,
    });
    const triggerRef = useRef(null);
    return (_jsx(PopoverContext.Provider, { value: {
            open: Boolean(currentOpen),
            setOpen,
            modal,
            triggerRef: triggerRef,
        }, children: children }));
}
const Trigger = forwardRef(function Trigger({ asChild, onClick, ...props }, ref) {
    const { setOpen, triggerRef } = usePopoverContext();
    return (_jsx(Slottable, { asChild: asChild, children: _jsx("button", { ref: (node) => {
                triggerRef.current = node;
                if (typeof ref === 'function')
                    ref(node);
                else if (ref)
                    ref.current = node;
            }, type: "button", "aria-haspopup": "dialog", onClick: (e) => {
                onClick?.(e);
                if (!e.defaultPrevented)
                    setOpen(true);
            }, ...props }) }));
});
function PortalWrapper({ children }) {
    const { open } = usePopoverContext();
    if (!open)
        return null;
    return _jsx(Portal, { children: children });
}
const Content = forwardRef(function Content({ side = 'bottom', sideOffset = 8, style, ...props }, ref) {
    const { setOpen, triggerRef, modal } = usePopoverContext();
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const contentRef = useRef(null);
    useEffect(() => {
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!trigger)
            return;
        const rect = trigger.getBoundingClientRect();
        let top = rect.bottom + sideOffset;
        let left = rect.left;
        if (side === 'top') {
            top = rect.top - sideOffset;
            left = rect.left;
        }
        else if (side === 'left') {
            top = rect.top;
            left = rect.left - sideOffset;
        }
        else if (side === 'right') {
            top = rect.top;
            left = rect.right + sideOffset;
        }
        if (content) {
            const contentRect = content.getBoundingClientRect();
            // Horizontal collision protection
            if (left < 4) {
                left = 4;
            }
            else if (left + contentRect.width > window.innerWidth - 4) {
                left = window.innerWidth - contentRect.width - 4;
            }
            // Vertical collision protection and auto-flipping
            if (side === 'bottom' &&
                top + contentRect.height > window.innerHeight - 4) {
                const topFit = rect.top - sideOffset - contentRect.height;
                if (topFit >= 4) {
                    top = topFit;
                }
            }
            else if (side === 'top' && top < 4) {
                const bottomFit = rect.bottom + sideOffset;
                if (bottomFit + contentRect.height <= window.innerHeight - 4) {
                    top = bottomFit;
                }
            }
        }
        setPosition({ top, left });
    }, [side, sideOffset, triggerRef]);
    useEffect(() => {
        const node = contentRef.current;
        if (!node || !modal)
            return;
        return trapFocus(node, () => setOpen(false));
    }, [modal, setOpen]);
    useEffect(() => {
        const onDoc = (e) => {
            const target = e.target;
            if (contentRef.current?.contains(target))
                return;
            if (triggerRef.current?.contains(target))
                return;
            setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [setOpen, triggerRef]);
    return (_jsx("div", { ref: (node) => {
            contentRef.current = node;
            if (typeof ref === 'function')
                ref(node);
            else if (ref)
                ref.current = node;
        }, role: "dialog", "aria-modal": modal || undefined, style: {
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 50,
            ...style,
        }, "data-state": "open", ...props }));
});
export const Popover = { Root, Trigger, Portal: PortalWrapper, Content };
