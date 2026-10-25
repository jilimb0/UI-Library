import {
  createTabContentBehavior,
  createTabTriggerBehavior,
} from '@ui-construction-library/behaviors';
import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import { useControllableState } from './internal/useControllableState';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  tabValues: React.MutableRefObject<string[]>;
  tabRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  uid: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within Tabs.Root');
  return ctx;
}

export interface TabsRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function Root({
  value,
  defaultValue = '',
  onValueChange,
  children,
  className,
  style,
}: TabsRootProps) {
  const [current, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const tabValues = useRef<string[]>([]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();

  return (
    <TabsContext.Provider
      value={{
        value: current ?? defaultValue,
        setValue,
        tabValues,
        tabRefs,
        uid,
      }}
    >
      <div className={className} style={style}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const List = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function List(props, ref) {
    return <div ref={ref} role="tablist" {...props} />;
  }
);

const Trigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(function Trigger({ value: tabValue, onClick, onKeyDown, ...props }, ref) {
  const { value, setValue, tabValues, tabRefs, uid } = useTabsContext();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = `${uid}-${tabValue}`;

  useEffect(() => {
    tabValues.current.push(tabValue);
    tabRefs.current[tabValue] = triggerRef.current;
    return () => {
      tabValues.current = tabValues.current.filter((v) => v !== tabValue);
      delete tabRefs.current[tabValue];
    };
  }, [tabValue, tabValues, tabRefs]);

  const focusTab = (target: string) => {
    setValue(target);
    tabRefs.current[target]?.focus();
  };

  const onNext = () => {
    const values = tabValues.current;
    const idx = values.indexOf(tabValue);
    const next = values[(idx + 1) % values.length];
    if (next) focusTab(next);
  };

  const onPrev = () => {
    const values = tabValues.current;
    const idx = values.indexOf(tabValue);
    const prev = values[(idx - 1 + values.length) % values.length];
    if (prev) focusTab(prev);
  };

  const onFirst = () => {
    const first = tabValues.current[0];
    if (first) focusTab(first);
  };

  const onLast = () => {
    const last = tabValues.current[tabValues.current.length - 1];
    if (last) focusTab(last);
  };

  const behavior = createTabTriggerBehavior({
    value,
    tabValue,
    onValueChange: setValue,
    onNext,
    onPrev,
    onFirst,
    onLast,
    panelId,
  });

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
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
  HTMLAttributes<HTMLDivElement> & { value: string }
>(function Content({ value: tabValue, hidden, ...props }, ref) {
  const { value, uid } = useTabsContext();
  const active = value === tabValue;
  const panelId = `${uid}-${tabValue}`;
  const behavior = createTabContentBehavior({ value, tabValue });

  return (
    <div
      ref={ref}
      id={panelId}
      {...behavior.contentAttrs}
      hidden={!active || hidden}
      {...props}
    />
  );
});

export const Tabs = { Root, List, Trigger, Content };
