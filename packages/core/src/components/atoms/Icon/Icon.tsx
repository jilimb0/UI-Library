
import * as React from 'react';
import { LucideProps } from 'lucide-react';
import * as Icons from 'lucide-react';

export interface IconProps extends LucideProps {
  name: keyof typeof Icons;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(({
  name,
  ...props
}, ref) => {
  const Component = Icons[name];
  if (!Component) return null;
  return <Component ref={ref} data-testid="icon-svg" {...props} />;
});

Icon.displayName = 'Icon';

export { Icon };
