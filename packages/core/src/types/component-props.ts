import type { ReactNode } from 'react';

export interface UCLComponentProps {
  className?: string;
  children?: ReactNode;
}

export type ComponentSize = 'sm' | 'md' | 'lg';
