import {
  createAccordionContentBehavior,
  createAccordionTriggerBehavior,
} from '@ui-construction-library/behaviors';
import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  useContext,
  useState,
} from 'react';

type AccordionContextValue = {
  type: 'single' | 'multiple';
  openItems: Set<string>;
  toggle: (value: string) => void;
  collapsible: boolean;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

function Root({
  type = 'single',
  collapsible = false,
  defaultValue,
  children,
  ...props
}: AccordionRootProps) {
  const initial = new Set<string>(
    Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
        ? [defaultValue]
        : []
  );
  const [openItems, setOpenItems] = useState(initial);

  const toggle = (itemValue: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (type === 'multiple') {
        if (next.has(itemValue)) next.delete(itemValue);
        else next.add(itemValue);
      } else if (next.has(itemValue) && collapsible) {
        next.delete(itemValue);
      } else {
        next.clear();
        next.add(itemValue);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ type, openItems, toggle, collapsible }}>
      <div {...props}>{children}</div>
    </AccordionContext.Provider>
  );
}

const ItemContext = createContext<string>('');

const Item = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { value: string }
>(function Item({ value, children, ...props }, ref) {
  return (
    <ItemContext.Provider value={value}>
      <div ref={ref} data-value={value} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  );
});

const Header = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function Header(props, ref) {
  return <h3 ref={ref} {...props} />;
});

const Trigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }
>(function Trigger({ value, onClick, ...props }, ref) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(ItemContext);
  const itemValue = value ?? itemCtx ?? '';
  const open = ctx?.openItems.has(itemValue) ?? false;
  const behavior = createAccordionTriggerBehavior({ open });

  return (
    <button
      ref={ref}
      type="button"
      {...behavior.triggerAttrs}
      onClick={(e) => {
        onClick?.(e);
        if (itemValue) ctx?.toggle(itemValue);
      }}
      {...props}
    />
  );
});

const Content = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { value?: string }
>(function Content({ value, children, ...props }, ref) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(ItemContext);
  const itemValue = value ?? itemCtx ?? '';
  const open = ctx?.openItems.has(itemValue) ?? false;
  const behavior = createAccordionContentBehavior({ open });

  if (!open) return null;

  return (
    <section ref={ref} {...behavior.contentAttrs} {...props}>
      {children}
    </section>
  );
});

export const Accordion = { Root, Item, Trigger, Header, Content };
