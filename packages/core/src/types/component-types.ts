import type { VariantProps as TvVariantProps } from 'tailwind-variants';
import type { badgeVariants } from '../components/atoms/Badge/Badge';
import type { buttonVariants } from '../components/atoms/Button/Button';
import type { tagVariants } from '../components/atoms/Tag/Tag';
import type { textVariants } from '../components/atoms/Text/Text';
import type { textareaVariants } from '../components/atoms/TextArea/TextArea';
import type { dropdownVariants } from '../components/molecules/Dropdown/Dropdown';
import type { popoverContentVariants } from '../components/molecules/Popover/Popover';
import type { sliderVariants } from '../components/molecules/Slider/Slider';
import type { modalContentVariants } from '../components/organisms/Modal/Modal';

// Shared base props and common component sizes
export type { ComponentSize, UCLComponentProps } from './component-props';

// Button component props types
export type ButtonVariant = TvVariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = TvVariantProps<typeof buttonVariants>['size'];
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
export type TextSize = TvVariantProps<typeof textVariants>['size'];
export type TextWeight = TvVariantProps<typeof textVariants>['weight'];

// Badge component props types
export type BadgeVariant = TvVariantProps<typeof badgeVariants>['variant'];

// Tag component props types
export type TagVariant = TvVariantProps<typeof tagVariants>['variant'];
export type TagSize = TvVariantProps<typeof tagVariants>['size'];

// TextArea component props types
export type TextAreaVariant = TvVariantProps<
  typeof textareaVariants
>['variant'];
export type TextAreaSize = TvVariantProps<typeof textareaVariants>['size'];

// Overlay component size types
export type ModalSize = TvVariantProps<typeof modalContentVariants>['size'];
export type PopoverSize = TvVariantProps<typeof popoverContentVariants>['size'];
export type DropdownSize = TvVariantProps<typeof dropdownVariants>['size'];

// Slider component props types
export type SliderSize = TvVariantProps<typeof sliderVariants>['size'];
export type SliderOrientation = TvVariantProps<
  typeof sliderVariants
>['orientation'];
