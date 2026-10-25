import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { type ClassValue, clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';
export { tv, type VariantProps } from './variants';

/**
 * Merge className with Tailwind CSS classes
 * @param inputs - className values to merge
 * @returns merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
