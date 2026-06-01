import { type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
export type SliderRootProps = HTMLAttributes<HTMLDivElement> & {
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
};
export declare const Slider: {
    Root: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
        value?: number[];
        defaultValue?: number[];
        onValueChange?: (value: number[]) => void;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
    } & import("react").RefAttributes<HTMLDivElement>>;
    Track: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
    Range: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
    Thumb: import("react").ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & import("react").RefAttributes<HTMLButtonElement>>;
};
