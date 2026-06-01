import { type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
export type SwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
};
export declare const Switch: {
    Root: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
        checked?: boolean;
        defaultChecked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
    } & import("react").RefAttributes<HTMLButtonElement>>;
    Thumb: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLSpanElement> & import("react").RefAttributes<HTMLSpanElement>>;
};
