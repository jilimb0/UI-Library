import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
export interface TabsRootProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    children?: ReactNode;
}
declare function Root({ value, defaultValue, onValueChange, children, }: TabsRootProps): import("react/jsx-runtime").JSX.Element;
export declare const Tabs: {
    Root: typeof Root;
    List: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
    Trigger: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
        value: string;
    } & import("react").RefAttributes<HTMLButtonElement>>;
    Content: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        value: string;
    } & import("react").RefAttributes<HTMLDivElement>>;
};
export {};
