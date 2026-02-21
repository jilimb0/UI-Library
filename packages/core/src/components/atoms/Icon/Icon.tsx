import { LucideProps, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { forwardRef, ComponentPropsWithRef } from 'react';

type IconName = keyof typeof Icons;

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  // Приводим к типу LucideIcon
  const LucideIcon = Icons[name as IconName] as LucideIcon;

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
