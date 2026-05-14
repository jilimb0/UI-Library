import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
} from 'react';

export interface TabsProps {
  children: ReactNode;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, defaultIndex = 0, onChange, ...props }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

    const handleSelect = (index: number) => {
      setSelectedIndex(index);
      onChange?.(index);
    };

    return (
      <div ref={ref} {...props}>
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return cloneElement(child as ReactElement<any>, {
            selected: selectedIndex === index,
            onSelect: () => handleSelect(index),
          });
        })}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
