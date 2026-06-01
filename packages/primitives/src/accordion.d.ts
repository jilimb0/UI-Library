import { type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
}
declare function Root({ type, collapsible, defaultValue, children, ...props }: AccordionRootProps): import("react/jsx-runtime").JSX.Element;
export declare const Accordion: {
    Root: typeof Root;
    Item: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        value: string;
    } & import("react").RefAttributes<HTMLDivElement>>;
    Trigger: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
        value?: string;
    } & import("react").RefAttributes<HTMLButtonElement>>;
    Header: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLHeadingElement> & import("react").RefAttributes<HTMLHeadingElement>>;
    Content: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        value?: string;
    } & import("react").RefAttributes<HTMLDivElement>>;
};
export {};
