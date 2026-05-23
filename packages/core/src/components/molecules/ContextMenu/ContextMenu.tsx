import { ContextMenu as PrimitiveContextMenu } from '@ui-construction-library/primitives';
import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface ContextMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** When true, the item is visually muted and non-interactive. */
  disabled?: boolean;
  /** Visual variant for the item. */
  variant?: 'default' | 'destructive';
}

export interface ContextMenuProps {
  trigger: ReactNode;
  items: ContextMenuItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function ContextMenu({
  trigger,
  items,
  className,
  style,
}: ContextMenuProps) {
  return (
    <PrimitiveContextMenu.Root>
      <PrimitiveContextMenu.Trigger asChild>
        {trigger}
      </PrimitiveContextMenu.Trigger>
      <PrimitiveContextMenu.Portal>
        <PrimitiveContextMenu.Content
          className={cn('dropdown-menu', className)}
          style={style}
        >
          {items.map((item) => (
            <PrimitiveContextMenu.Item
              key={item.id}
              onSelect={item.disabled ? undefined : item.onSelect}
              aria-disabled={item.disabled || undefined}
              className={cn(
                'dropdown-menu__item',
                item.variant === 'destructive' &&
                  'dropdown-menu__item--destructive'
              )}
              onClick={
                item.disabled
                  ? (e: React.MouseEvent) => e.preventDefault()
                  : undefined
              }
            >
              {item.icon && <span className="button__icon">{item.icon}</span>}
              {item.label}
            </PrimitiveContextMenu.Item>
          ))}
        </PrimitiveContextMenu.Content>
      </PrimitiveContextMenu.Portal>
    </PrimitiveContextMenu.Root>
  );
}
