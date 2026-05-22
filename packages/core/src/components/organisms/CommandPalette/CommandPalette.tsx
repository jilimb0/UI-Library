import { Command } from 'cmdk';
import type React from 'react';
import type { ReactNode } from 'react';
import { RadixDialog as Dialog } from '../../../adapters/radix';

export interface CommandPaletteItem {
  id: string;
  label: string;
  keywords?: string[];
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteGroup {
  heading: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandPaletteGroup[];
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
}: CommandPaletteProps) {
  const CommandRoot = Command as unknown as React.ComponentType<
    React.ComponentProps<typeof Command>
  >;
  const CommandInput = Command.Input as unknown as React.ComponentType<
    React.ComponentProps<typeof Command.Input>
  >;
  const CommandList = Command.List as unknown as React.ComponentType<
    React.ComponentProps<typeof Command.List>
  >;
  const CommandEmpty = Command.Empty as unknown as React.ComponentType<
    React.ComponentProps<typeof Command.Empty>
  >;
  const CommandGroup = Command.Group as unknown as React.ComponentType<
    React.ComponentProps<typeof Command.Group>
  >;
  const CommandItem = Command.Item as unknown as React.ComponentType<
    React.ComponentProps<typeof Command.Item>
  >;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-20 z-50 w-full max-w-xl -translate-x-1/2 rounded-lg bg-white p-2 shadow-xl">
          <CommandRoot>
            <CommandInput
              className="w-full border-b border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="Type a command..."
            />
            <CommandList className="max-h-80 overflow-auto p-1">
              <CommandEmpty className="px-3 py-2 text-sm text-slate-500">
                No results.
              </CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.label}
                      keywords={item.keywords}
                      onSelect={() => {
                        item.onSelect();
                        onOpenChange(false);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm data-[selected=true]:bg-slate-100"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </CommandRoot>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
