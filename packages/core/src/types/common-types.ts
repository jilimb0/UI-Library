import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SyntheticEvent,
} from 'react';

// General utility types
export type Children = ReactNode;
export type Maybe<T> = T | null | undefined;
export type EmptyObject = Record<string, never>;
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

// Callback types
export type VoidCallback = () => void;
export type EventCallback<E extends SyntheticEvent> = (event: E) => void;

// Directional types
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Placement = 'top' | 'bottom' | 'left' | 'right';

// Component base props
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: Children;
}

// HTML element attributes
export type DivElementProps = HTMLAttributes<HTMLDivElement>;
export type ButtonElementProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type InputElementProps = InputHTMLAttributes<HTMLInputElement>;
export type AnchorElementProps = AnchorHTMLAttributes<HTMLAnchorElement>;
// Add more as needed
