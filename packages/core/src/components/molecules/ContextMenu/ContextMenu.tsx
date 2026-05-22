import type { ReactNode } from 'react';
import { RadixContextMenu } from '../../../adapters/radix';

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
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>{trigger}</RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content className="z-50 min-w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
          {items.map((item) => (
            <RadixContextMenu.Item
              key={item.id}
              onSelect={item.onSelect}
              className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
            >
              {item.label}
            </RadixContextMenu.Item>
          ))}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
