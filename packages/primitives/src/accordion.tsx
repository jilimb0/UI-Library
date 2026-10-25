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
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

type AccordionContextValue = {
  type: 'single' | 'multiple';
  openItems: Set<string>;
  toggle: (value: string) => void;
  collapsible: boolean;
  uid: string;
  triggerValues: React.MutableRefObject<string[]>;
  triggerRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
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
  const uid = useId();
  const triggerValues = useRef<string[]>([]);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    <AccordionContext.Provider
      value={{
        type,
        openItems,
        toggle,
        collapsible,
        uid,
        triggerValues,
        triggerRefs,
      }}
    >
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
>(function Trigger({ value, onClick, onKeyDown, ...props }, ref) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(ItemContext);
  const itemValue = value ?? itemCtx ?? '';
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const open = ctx?.openItems.has(itemValue) ?? false;
  const contentId = `${ctx?.uid ?? ''}-${itemValue}`;
  const triggerId = `${contentId}-trigger`;

  useEffect(() => {
    if (!itemValue || !ctx) return;
    ctx.triggerValues.current.push(itemValue);
    ctx.triggerRefs.current[itemValue] = triggerRef.current;
    return () => {
      ctx.triggerValues.current = ctx.triggerValues.current.filter(
        (v) => v !== itemValue
      );
      delete ctx.triggerRefs.current[itemValue];
    };
  }, [itemValue, ctx]);

  const focusHeader = (target: string) => {
    ctx?.triggerRefs.current[target]?.focus();
  };

  const onNext = () => {
    const values = ctx?.triggerValues.current ?? [];
    const idx = values.indexOf(itemValue);
    const next = values[(idx + 1) % values.length];
    if (next) focusHeader(next);
  };

  const onPrev = () => {
    const values = ctx?.triggerValues.current ?? [];
    const idx = values.indexOf(itemValue);
    const prev = values[(idx - 1 + values.length) % values.length];
    if (prev) focusHeader(prev);
  };

  const onFirst = () => {
    const first = ctx?.triggerValues.current[0];
    if (first) focusHeader(first);
  };

  const onLast = () => {
    const values = ctx?.triggerValues.current ?? [];
    const last = values[values.length - 1];
    if (last) focusHeader(last);
  };

  const behavior = createAccordionTriggerBehavior({
    open,
    onToggle: () => {
      if (itemValue) ctx?.toggle(itemValue);
    },
    contentId,
    onNext,
    onPrev,
    onFirst,
    onLast,
  });

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      id={triggerId}
      {...behavior.triggerAttrs}
      onClick={(e) => {
        behavior.handlers.onClick?.();
        onClick?.(e);
      }}
      onKeyDown={(e) => {
        behavior.handlers.onKeyDown?.(e);
        onKeyDown?.(e);
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
  const contentId = `${ctx?.uid ?? ''}-${itemValue}`;
  const triggerId = `${contentId}-trigger`;
  const behavior = createAccordionContentBehavior({
    open,
    id: contentId,
    triggerId,
  });

  if (!open) return null;

  return (
    <section ref={ref} {...behavior.contentAttrs} {...props}>
      {children}
    </section>
  );
});

export const Accordion = { Root, Item, Trigger, Header, Content };
