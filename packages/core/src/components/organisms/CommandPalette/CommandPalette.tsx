import { Dialog } from '@ui-construction-library/primitives';
import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

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
  placeholder?: string;
  emptyMessage?: string;
  style?: CSSProperties;
}

function matchesQuery(item: CommandPaletteItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.label.toLowerCase().includes(q)) return true;
  return (
    item.keywords?.some((keyword) => keyword.toLowerCase().includes(q)) ?? false
  );
}

function filterGroups(
  groups: CommandPaletteGroup[],
  query: string
): CommandPaletteGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesQuery(item, query)),
    }))
    .filter((group) => group.items.length > 0);
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command...',
  emptyMessage = 'No results.',
  style,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterGroups(groups, query), [groups, query]);

  // Stable reference for keyboard nav
  const filteredFlatItems = useMemo(
    () => filtered.flatMap((g) => g.items),
    [filtered]
  );

  const selectItem = useCallback(
    (item: CommandPaletteItem) => {
      item.onSelect();
      onOpenChange(false);
    },
    [onOpenChange]
  );

  // Reset state when palette opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (filteredFlatItems.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % filteredFlatItems.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(
          (index) =>
            (index - 1 + filteredFlatItems.length) % filteredFlatItems.length
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const item = filteredFlatItems[activeIndex];
        if (item) selectItem(item);
      } else if (event.key === 'Home') {
        event.preventDefault();
        setActiveIndex(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(filteredFlatItems.length - 1);
      }
    },
    [filteredFlatItems, activeIndex, selectItem]
  );

  let itemOffset = 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-backdrop" />
        <Dialog.Content className="command-palette">
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded
            aria-controls="command-palette-list"
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0
                ? `command-item-${filteredFlatItems[activeIndex]?.id}`
                : undefined
            }
            className="command-palette__input"
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
          />
          <div
            id="command-palette-list"
            role="listbox"
            ref={listRef}
            className="command-palette__list"
            style={style}
          >
            {filteredFlatItems.length === 0 ? (
              <p className="command-palette__empty">{emptyMessage}</p>
            ) : (
              filtered.map((group) => (
                <div key={group.heading} role="presentation">
                  <p className="command-palette__heading">{group.heading}</p>
                  {group.items.map((item) => {
                    const index = itemOffset++;
                    const active = index === activeIndex;
                    return (
                      <button
                        key={item.id}
                        id={`command-item-${item.id}`}
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={cn(
                          'command-palette__item',
                          active && 'command-palette__item--active'
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectItem(item)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
