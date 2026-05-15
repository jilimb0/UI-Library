import * as RadixPopover from '@radix-ui/react-popover';
import type { ReactNode } from 'react';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Popover({ trigger, content, side = 'bottom' }: PopoverProps) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          sideOffset={8}
          className="z-50 rounded-md border border-slate-200 bg-white p-3 shadow-lg"
        >
          {content}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
