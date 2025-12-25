import React from 'react';
import * as ActionIcons from './action';
import * as InterfaceIcons from './interface';
import * as NavigationIcons from './navigation';
import * as SocialIcons from './social';
import * as StatusIcons from './status';

const Icons = {
  ...ActionIcons,
  ...InterfaceIcons,
  ...NavigationIcons,
  ...SocialIcons,
  ...StatusIcons,
};

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, ...props }, ref) => {
    const Component = Icons[name];

    if (!Component) {
      return null;
    }

    return <Component ref={ref} {...props} />;
  }
);

Icon.displayName = 'Icon';
