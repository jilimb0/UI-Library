
import * as React from 'react';

// General utility types
export type Children = React.ReactNode;
export type Maybe<T> = T | null | undefined;
export type EmptyObject = Record<string, never>;
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

// Callback types
export type VoidCallback = () => void;
export type EventCallback<E extends React.SyntheticEvent> = (event: E) => void;

// Directional types
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Placement = 'top' | 'bottom' | 'left' | 'right';

// Component base props
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: Children;
}

// HTML element attributes
export type DivElementProps = React.HTMLAttributes<HTMLDivElement>;
export type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type InputElementProps = React.InputHTMLAttributes<HTMLInputElement>;
export type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
// Add more as needed
