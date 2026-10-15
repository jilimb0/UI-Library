import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { cva, type VariantProps } from 'class-variance-authority';
export { type ClassValue, clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';

/**
 * Merge className with Tailwind CSS classes
 * @param inputs - className values to merge
 * @returns merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
