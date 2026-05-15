import * as LucideIcons from 'lucide-react';

export { CheckIcon } from './CheckIcon';
export { CloseIcon } from './CloseIcon';

export const lucideIcons = LucideIcons;
export type LucideIconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-down'
  | 'chevron-up'
  | 'check'
  | 'x'
  | 'search'
  | 'settings'
  | 'user'
  | 'home'
  | 'mail'
  | 'bell'
  | 'star'
  | 'heart';

export const lucideNameMap: Record<LucideIconName, keyof typeof LucideIcons> = {
  'arrow-right': 'ArrowRight',
  'arrow-left': 'ArrowLeft',
  'chevron-down': 'ChevronDown',
  'chevron-up': 'ChevronUp',
  check: 'Check',
  x: 'X',
  search: 'Search',
  settings: 'Settings',
  user: 'User',
  home: 'Home',
  mail: 'Mail',
  bell: 'Bell',
  star: 'Star',
  heart: 'Heart',
};
