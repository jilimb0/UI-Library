import type { ComponentPropsWithoutRef } from 'react';
import { RadixTabs } from '../../../adapters/radix';
import { cn } from '../../../utils/cn';

function TabsRoot(props: ComponentPropsWithoutRef<typeof RadixTabs.Root>) {
  return <RadixTabs.Root {...props} />;
}

function TabsList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-slate-100 p-1',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'rounded px-3 py-1.5 text-sm font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
  return <RadixTabs.Content className={cn('mt-4', className)} {...props} />;
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
