import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useEffect, useId, useRef, } from 'react';
import { trapFocus } from './internal/focusTrap';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';
const DialogContext = createContext(null);
function useDialogContext() {
    const ctx = useContext(DialogContext);
    if (!ctx)
        throw new Error('Dialog components must be used within Dialog.Root');
    return ctx;
}
function Root({ open, defaultOpen, onOpenChange, children }) {
    const [currentOpen, setOpen] = useControllableState({
        value: open,
        defaultValue: defaultOpen ?? false,
        onChange: onOpenChange,
    });
    const titleId = useId();
    const descriptionId = useId();
    return (_jsx(DialogContext.Provider, { value: {
            open: Boolean(currentOpen),
            setOpen,
            titleId,
            descriptionId,
        }, children: children }));
}
const Trigger = forwardRef(function Trigger({ asChild, onClick, ...props }, ref) {
    const { setOpen } = useDialogContext();
    return (_jsx(Slottable, { asChild: asChild, children: _jsx("button", { ref: ref, type: "button", onClick: (e) => {
                onClick?.(e);
                if (!e.defaultPrevented)
                    setOpen(true);
            }, ...props }) }));
});
const Close = forwardRef(function Close({ asChild, onClick, ...props }, ref) {
    const { setOpen } = useDialogContext();
    return (_jsx(Slottable, { asChild: asChild, children: _jsx("button", { ref: ref, type: "button", onClick: (e) => {
                onClick?.(e);
                if (!e.defaultPrevented)
                    setOpen(false);
            }, ...props }) }));
});
function PortalWrapper({ children }) {
    const { open } = useDialogContext();
    if (!open)
        return null;
    return _jsx(Portal, { children: children });
}
const Overlay = forwardRef(function Overlay(props, ref) {
    const { setOpen } = useDialogContext();
    return (
    // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
    _jsx("div", { ref: ref, role: "presentation", "data-state": "open", tabIndex: -1, onClick: () => setOpen(false), onKeyDown: (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        }, ...props }));
});
const Content = forwardRef(function Content({ onClick, onKeyDown: onKeyDownProp, ...props }, ref) {
    const { setOpen, titleId, descriptionId } = useDialogContext();
    const contentRef = useRef(null);
    useEffect(() => {
        const node = contentRef.current;
        if (!node)
            return;
        return trapFocus(node, () => setOpen(false));
    }, [setOpen]);
    return (_jsx("div", { ref: (node) => {
            contentRef.current = node;
            if (typeof ref === 'function')
                ref(node);
            else if (ref)
                ref.current = node;
        }, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": descriptionId, "data-state": "open", onClick: (e) => {
            onClick?.(e);
            e.stopPropagation();
        }, onKeyDown: (e) => {
            onKeyDownProp?.(e);
            if (e.key === 'Escape') {
                e.stopPropagation();
                setOpen(false);
            }
            else {
                e.stopPropagation();
            }
        }, ...props }));
});
const Title = forwardRef(function Title(props, ref) {
    const { titleId } = useDialogContext();
    return _jsx("h2", { ref: ref, id: titleId, ...props });
});
const Description = forwardRef(function Description(props, ref) {
    const { descriptionId } = useDialogContext();
    return _jsx("p", { ref: ref, id: descriptionId, ...props });
});
export const Dialog = {
    Root,
    Trigger,
    Close,
    Portal: PortalWrapper,
    Overlay,
    Content,
    Title,
    Description,
};
