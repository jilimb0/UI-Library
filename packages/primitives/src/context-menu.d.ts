import { type HTMLAttributes, type ReactNode } from 'react';
export interface ContextMenuRootProps {
    /** Controlled open state. */
    open?: boolean;
    /** Default open state for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Callback fired when the open state changes. */
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function Root({ open, defaultOpen, onOpenChange, children, }: ContextMenuRootProps): import("react/jsx-runtime").JSX.Element;
declare function PortalWrapper({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare const ContextMenu: {
    Root: typeof Root;
    Trigger: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        asChild?: boolean;
    } & import("react").RefAttributes<HTMLDivElement>>;
    Portal: typeof PortalWrapper;
    Content: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
    Item: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        onSelect?: () => void;
    } & import("react").RefAttributes<HTMLDivElement>>;
};
export {};
