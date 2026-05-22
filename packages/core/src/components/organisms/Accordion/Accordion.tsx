import type { ComponentPropsWithoutRef } from 'react';
import { RadixAccordion } from '../../../adapters/radix';
import { cn } from '../../../utils/cn';

function AccordionRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixAccordion.Root>) {
  return <RadixAccordion.Root className={cn(className)} {...props} />;
}

function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixAccordion.Item>) {
  return (
    <RadixAccordion.Item
      className={cn('border-b border-slate-200', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>) {
  return (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger
        className={cn(
          'flex w-full items-center justify-between py-3 text-left text-sm font-medium',
          className
        )}
        {...props}
      />
    </RadixAccordion.Header>
  );
}

function AccordionContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixAccordion.Content>) {
  return (
    <RadixAccordion.Content
      className={cn('pb-3 text-sm text-slate-600', className)}
      {...props}
    />
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
