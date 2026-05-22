import {
  type IconName,
  type IconProps,
  iconRegistry,
} from '@ui-construction-library/icons';
import { type ComponentType, forwardRef } from 'react';

export type { IconName };
/** @deprecated Use IconName */
export type LucideIconName = IconName;

export interface UIIconProps extends Omit<IconProps, 'ref'> {
  name?: IconName;
  as?: ComponentType<IconProps>;
  /** Lucide-compat: maps to width and height */
  size?: number | string;
}

const Icon = forwardRef<SVGSVGElement, UIIconProps>(
  ({ name = 'check', as, size, width, height, ...props }, ref) => {
    const ResolvedIcon = as ?? iconRegistry[name];
    const dimension = size ?? width ?? height;
    return (
      <ResolvedIcon
        ref={ref}
        data-testid="icon-svg"
        width={width ?? dimension}
        height={height ?? dimension}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };
