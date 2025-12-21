
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../components/atoms/Button/Button';
import { inputVariants } from '../components/atoms/Input/Input';
import { textVariants } from '../components/atoms/Text/Text';
import { badgeVariants } from '../components/atoms/Badge/Badge';
import { selectVariants } from '../components/atoms/Select/Select';
import { textareaVariants } from '../components/atoms/Textarea/Textarea';

// Common component sizes
export type ComponentSize = 'sm' | 'md' | 'lg';

// Button component props types
export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

// Input component props types
export type InputVariant = VariantProps<typeof inputVariants>['variant'];
export type InputSize = VariantProps<typeof inputVariants>['size'];

// Text component props types
export type TextSize = VariantProps<typeof textVariants>['size'];
export type TextWeight = VariantProps<typeof textVariants>['weight'];

// Badge component props types
export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

// Select component props types
export type SelectSize = VariantProps<typeof selectVariants>['size'];

// Textarea component props types
export type TextareaVariant = VariantProps<typeof textareaVariants>['variant'];
export type TextareaSize = VariantProps<typeof textareaVariants>['size'];

// Add more component-specific types here as needed
