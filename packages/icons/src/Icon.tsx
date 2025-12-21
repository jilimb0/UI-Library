import * as React from 'react';
import * as ActionIcons from './icons/action';
import * as InterfaceIcons from './icons/interface';
import * as NavigationIcons from './icons/navigation';
import * as SocialIcons from './icons/social';
import * as StatusIcons from './icons/status';
import { IconName } from './types';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const Icons = {
  ...ActionIcons,
  ...InterfaceIcons,
  ...NavigationIcons,
  ...SocialIcons,
  ...StatusIcons,
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const Component = Icons[name];
  if (!Component) return null;

  return <Component ref={ref} {...props} />;
});

Icon.displayName = 'Icon';
