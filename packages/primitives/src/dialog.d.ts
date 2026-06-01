import { type HTMLAttributes, type ReactNode } from 'react';
export interface DialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function Root({ open, defaultOpen, onOpenChange, children }: DialogRootProps): import("react/jsx-runtime").JSX.Element;
declare function PortalWrapper({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare const Dialog: {
    Root: typeof Root;
    Trigger: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLButtonElement> & {
        asChild?: boolean;
    } & import("react").RefAttributes<HTMLButtonElement>>;
    Close: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLButtonElement> & {
        asChild?: boolean;
    } & import("react").RefAttributes<HTMLButtonElement>>;
    Portal: typeof PortalWrapper;
    Overlay: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
    Content: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
    Title: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLHeadingElement> & import("react").RefAttributes<HTMLHeadingElement>>;
    Description: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLParagraphElement> & import("react").RefAttributes<HTMLParagraphElement>>;
};
export {};
