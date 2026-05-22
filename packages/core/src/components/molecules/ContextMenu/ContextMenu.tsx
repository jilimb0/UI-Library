import { ContextMenu as PrimitiveContextMenu } from '@ui-construction-library/primitives';
import type { ReactNode } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
}

export interface ContextMenuProps {
  trigger: ReactNode;
  items: ContextMenuItem[];
}

export function ContextMenu({ trigger, items }: ContextMenuProps) {
  return (
    <PrimitiveContextMenu.Root>
      <PrimitiveContextMenu.Trigger asChild>
        {trigger}
      </PrimitiveContextMenu.Trigger>
      <PrimitiveContextMenu.Portal>
        <PrimitiveContextMenu.Content className="dropdown-menu">
          {items.map((item) => (
            <PrimitiveContextMenu.Item
              key={item.id}
              onSelect={item.onSelect}
              className="dropdown-menu__item"
            >
              {item.label}
            </PrimitiveContextMenu.Item>
          ))}
        </PrimitiveContextMenu.Content>
      </PrimitiveContextMenu.Portal>
    </PrimitiveContextMenu.Root>
  );
}
