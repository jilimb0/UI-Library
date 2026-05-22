import { type ComponentType, forwardRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Home,
  type LucideProps,
  Mail,
  Search,
  Settings,
  Star,
  User,
  X,
} from '../../../adapters/icons';

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

type IconComponent = ComponentType<LucideProps>;

const lucideIconMap: Record<LucideIconName, IconComponent> = {
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  check: Check,
  x: X,
  search: Search,
  settings: Settings,
  user: User,
  home: Home,
  mail: Mail,
  bell: Bell,
  star: Star,
  heart: Heart,
};

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name?: LucideIconName;
  as?: IconComponent;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = 'check', as, ...props }, ref) => {
    const ResolvedIcon = as ?? lucideIconMap[name];
    return <ResolvedIcon ref={ref} data-testid="icon-svg" {...props} />;
  }
);

Icon.displayName = 'Icon';

export { Icon };
