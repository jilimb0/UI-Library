import { Accordion as PrimitiveAccordion } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../utils/cn';

function AccordionRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveAccordion.Root>) {
  return <PrimitiveAccordion.Root className={cn(className)} {...props} />;
}

function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveAccordion.Item>) {
  return (
    <PrimitiveAccordion.Item
      className={cn('border-b border-slate-200', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveAccordion.Trigger>) {
  return (
    <PrimitiveAccordion.Header>
      <PrimitiveAccordion.Trigger
        className={cn(
          'flex w-full items-center justify-between py-3 text-left text-sm font-medium',
          className
        )}
        {...props}
      />
    </PrimitiveAccordion.Header>
  );
}

function AccordionContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveAccordion.Content>) {
  return (
    <PrimitiveAccordion.Content
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
