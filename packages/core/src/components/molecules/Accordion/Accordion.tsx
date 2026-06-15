import { Accordion as PrimitiveAccordion } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../utils/cn';

function AccordionRoot({
  className,
  style,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveAccordion.Root>) {
  return (
    <PrimitiveAccordion.Root
      className={cn('accordion-root', className)}
      style={style}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PrimitiveAccordion.Item>) {
  return (
    <PrimitiveAccordion.Item
      className={cn('accordion-item', className)}
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
        className={cn('accordion-trigger', className)}
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
      className={cn('accordion-content', className)}
      {...props}
    />
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { AccordionContent, AccordionItem, AccordionTrigger };
