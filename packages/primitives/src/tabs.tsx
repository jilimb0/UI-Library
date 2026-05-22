import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from 'react';
import { useControllableState } from './internal/useControllableState';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
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
}

function Root({
  value,
  defaultValue = '',
  onValueChange,
  children,
}: TabsRootProps) {
  const [current, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsContext.Provider value={{ value: current ?? defaultValue, setValue }}>
      {children}
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
>(function Trigger({ value: tabValue, ...props }, ref) {
  const { value, setValue } = useTabsContext();
  const active = value === tabValue;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? 'active' : 'inactive'}
      onClick={() => setValue(tabValue)}
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

  return (
    <div
      ref={ref}
      role="tabpanel"
      hidden={!active || hidden}
      data-state={active ? 'active' : 'inactive'}
      {...props}
    />
  );
});

export const Tabs = { Root, List, Trigger, Content };
