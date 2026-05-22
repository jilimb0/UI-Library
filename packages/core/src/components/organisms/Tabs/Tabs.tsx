import { Tabs as PrimitiveTabs } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../utils/cn';

function TabsRoot(props: ComponentPropsWithoutRef<typeof PrimitiveTabs.Root>) {
  return <PrimitiveTabs.Root {...props} />;
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
