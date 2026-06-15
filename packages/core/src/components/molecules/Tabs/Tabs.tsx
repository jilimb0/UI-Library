import { Tabs as PrimitiveTabs } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

const TabsRoot = PrimitiveTabs.Root;
const TabsList = PrimitiveTabs.List;
const TabsTrigger = PrimitiveTabs.Trigger;
const TabsContent = PrimitiveTabs.Content;

type TabsRootProps = ComponentPropsWithoutRef<typeof PrimitiveTabs.Root> & {
  className?: string;
  style?: CSSProperties;
};

function TabsRootWrapper({ className, style, ...props }: TabsRootProps) {
  return (
    <TabsRoot className={cn('tabs-root', className)} style={style} {...props} />
  );
}

function TabsListWrapper({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveTabs.List>) {
  return <TabsList className={cn('tabs-list', className)} {...props} />;
}

function TabsTriggerWrapper({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveTabs.Trigger>) {
  return <TabsTrigger className={cn('tabs-trigger', className)} {...props} />;
}

function TabsContentWrapper({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveTabs.Content>) {
  return <TabsContent className={cn('tabs-content', className)} {...props} />;
}

export const Tabs = Object.assign(TabsRootWrapper, {
  List: TabsListWrapper,
  Trigger: TabsTriggerWrapper,
  Content: TabsContentWrapper,
});

export {
  TabsContentWrapper as TabsContent,
  TabsListWrapper as TabsList,
  TabsTriggerWrapper as TabsTrigger,
};
