import { Popover as PrimitivePopover } from '@ui-construction-library/primitives';
import type { ReactNode } from 'react';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Popover({ trigger, content, side = 'bottom' }: PopoverProps) {
  return (
    <PrimitivePopover.Root>
      <PrimitivePopover.Trigger asChild>{trigger}</PrimitivePopover.Trigger>
      <PrimitivePopover.Portal>
        <PrimitivePopover.Content
          side={side}
          sideOffset={8}
          className="popover"
        >
          {content}
        </PrimitivePopover.Content>
      </PrimitivePopover.Portal>
    </PrimitivePopover.Root>
  );
}
