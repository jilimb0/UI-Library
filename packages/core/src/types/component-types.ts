import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '../components/atoms/Badge/Badge';
import type { textVariants } from '../components/atoms/Text/Text';
import type { textareaVariants } from '../components/atoms/TextArea/TextArea';
import type { dropdownVariants } from '../components/molecules/Dropdown/Dropdown';
import type { popoverContentVariants } from '../components/molecules/Popover/Popover';
import type { modalContentVariants } from '../components/organisms/Modal/Modal';

// Common component sizes
export type ComponentSize = 'sm' | 'md' | 'lg';

// Button component props types
export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonBehaviorOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

// Input component props types
export type InputSize = 'sm' | 'default' | 'lg';

// Select component props types
export type SelectSize = 'sm' | 'default' | 'lg';

// Text component props types
export type TextSize = VariantProps<typeof textVariants>['size'];
export type TextWeight = VariantProps<typeof textVariants>['weight'];

// Badge component props types
export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

// TextArea component props types
export type TextAreaVariant = VariantProps<typeof textareaVariants>['variant'];
export type TextAreaSize = VariantProps<typeof textareaVariants>['size'];

// Overlay component size types
export type ModalSize = VariantProps<typeof modalContentVariants>['size'];
export type PopoverSize = VariantProps<typeof popoverContentVariants>['size'];
export type DropdownSize = VariantProps<typeof dropdownVariants>['size'];
