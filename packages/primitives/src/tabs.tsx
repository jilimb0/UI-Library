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
  useRef,
} from 'react';
import { useControllableState } from './internal/useControllableState';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  tabValues: React.MutableRefObject<string[]>;
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

  return (
    <TabsContext.Provider
      value={{ value: current ?? defaultValue, setValue, tabValues }}
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
  const { value, setValue, tabValues } = useTabsContext();
  const _active = value === tabValue;

  useEffect(() => {
    tabValues.current.push(tabValue);
    return () => {
      tabValues.current = tabValues.current.filter((v) => v !== tabValue);
    };
  }, [tabValue, tabValues]);

  const onNext = () => {
    const values = tabValues.current;
    const currentIndex = values.indexOf(tabValue);
    const nextIndex = (currentIndex + 1) % values.length;
    const nextValue = values[nextIndex];
    if (nextValue) setValue(nextValue);
  };

  const onPrev = () => {
    const values = tabValues.current;
    const currentIndex = values.indexOf(tabValue);
    const prevIndex = (currentIndex - 1 + values.length) % values.length;
    const prevValue = values[prevIndex];
    if (prevValue) setValue(prevValue);
  };

  const behavior = createTabTriggerBehavior({
    value,
    tabValue,
    onValueChange: setValue,
    onNext,
    onPrev,
  });

  return (
    <button
      ref={ref}
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
  const { value } = useTabsContext();
  const active = value === tabValue;
  const behavior = createTabContentBehavior({ value, tabValue });

  return (
    <div
      ref={ref}
      {...behavior.contentAttrs}
      hidden={!active || hidden}
      {...props}
    />
  );
});

export const Tabs = { Root, List, Trigger, Content };
