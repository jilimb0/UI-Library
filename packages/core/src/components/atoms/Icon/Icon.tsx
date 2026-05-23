import {
  type IconName,
  type IconProps,
  iconRegistry,
} from '@ui-construction-library/icons';
import { type ComponentType, forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export type { IconName };
/** @deprecated Use IconName */
export type LucideIconName = IconName;

export interface UIIconProps extends Omit<IconProps, 'ref'> {
  name?: IconName;
  as?: ComponentType<IconProps>;
  /** Lucide-compat: maps to width and height */
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon = forwardRef<SVGSVGElement, UIIconProps>(
  (
    { name = 'check', as, size, width, height, className, style, ...props },
    ref
  ) => {
    const ResolvedIcon = as ?? iconRegistry[name];
    const dimension = size ?? width ?? height;
    return (
      <ResolvedIcon
        ref={ref}
        data-testid="icon-svg"
        className={cn(className)}
        style={style}
        width={width ?? dimension}
        height={height ?? dimension}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };
