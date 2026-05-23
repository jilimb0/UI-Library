import { Tabs as PrimitiveTabs } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

type TabsRootProps = ComponentPropsWithoutRef<typeof PrimitiveTabs.Root> & {
  className?: string;
  style?: CSSProperties;
};

function TabsRoot({ className, style, ...props }: TabsRootProps) {
  return (
    <div className={cn('tabs-root', className)} style={style}>
      <PrimitiveTabs.Root {...props} />
    </div>
  );
}

function TabsList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveTabs.List>) {
  return (
    <PrimitiveTabs.List className={cn('tabs-list', className)} {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveTabs.Trigger>) {
  return (
    <PrimitiveTabs.Trigger
      className={cn('tabs-trigger', className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveTabs.Content>) {
  return (
    <PrimitiveTabs.Content
      className={cn('tabs-content', className)}
      {...props}
    />
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
