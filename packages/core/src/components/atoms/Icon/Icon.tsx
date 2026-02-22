import {
  LucideProps,
  Home,
  User,
  Settings,
  Search,
  Heart,
  Star,
  Bell,
  Mail,
  Check,
} from 'lucide-react';
import { forwardRef, ComponentPropsWithRef } from 'react';

const iconsMap = {
  Home,
  User,
  Settings,
  Search,
  Heart,
  Star,
  Bell,
  Mail,
  Check,
};

type IconName = keyof typeof iconsMap;

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const LucideIcon = iconsMap[name];

  if (!LucideIcon) return null;

  return (
    <LucideIcon
      ref={ref}
      data-testid="icon-svg"
      {...(props as ComponentPropsWithRef<'svg'>)}
    />
  );
});

Icon.displayName = 'Icon';

export { Icon };
