
import * as React from 'react';

export interface AccordionProps {
  multiple?: boolean;
  children: React.ReactNode;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(({
  multiple = false,
  children,
  ...props
}, ref) => {
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (multiple) {
      if (openItems.includes(index)) {
        setOpenItems(openItems.filter(i => i !== index));
      } else {
        setOpenItems([...openItems, index]);
      }
    } else {
      if (openItems[0] === index) {
        setOpenItems([]);
      } else {
        setOpenItems([index]);
      }
    }
  };

  return (
    <div ref={ref} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          isOpen: openItems.includes(index),
          onToggle: () => toggleItem(index),
        });
      })}
    </div>
  );
});
Accordion.displayName = 'Accordion';
