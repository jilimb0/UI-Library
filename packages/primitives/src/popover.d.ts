import { type HTMLAttributes, type ReactNode } from 'react';
declare function Root({ open, defaultOpen, onOpenChange, modal, children, }: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare function PortalWrapper({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare const Popover: {
    Root: typeof Root;
    Trigger: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLElement> & {
        asChild?: boolean;
    } & import("react").RefAttributes<HTMLElement>>;
    Portal: typeof PortalWrapper;
    Content: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        side?: "top" | "right" | "bottom" | "left";
        sideOffset?: number;
    } & import("react").RefAttributes<HTMLDivElement>>;
};
export {};
