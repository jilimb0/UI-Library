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
        <PrimitiveContextMenu.Content className="z-50 min-w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
          {items.map((item) => (
            <PrimitiveContextMenu.Item
              key={item.id}
              onSelect={item.onSelect}
              className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
            >
              {item.label}
            </PrimitiveContextMenu.Item>
          ))}
        </PrimitiveContextMenu.Content>
      </PrimitiveContextMenu.Portal>
    </PrimitiveContextMenu.Root>
  );
}
