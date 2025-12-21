
import * as React from 'react';

export interface TabsProps {
  children: React.ReactNode;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({
  children,
  defaultIndex = 0,
  onChange,
  ...props
}, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onChange?.(index);
  };

  return (
    <div ref={ref} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          selected: selectedIndex === index,
          onSelect: () => handleSelect(index),
        });
      })}
    </div>
  );
});

Tabs.displayName = 'Tabs';
