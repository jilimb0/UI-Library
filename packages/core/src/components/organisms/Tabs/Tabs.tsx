import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
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
          return cloneElement(child, {
            selected: selectedIndex === index,
            onSelect: () => handleSelect(index),
          });
        })}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
