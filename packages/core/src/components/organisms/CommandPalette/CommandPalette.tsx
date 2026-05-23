import { Dialog } from '@ui-construction-library/primitives';
import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
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

function filterGroups(groups: CommandPaletteGroup[], query: string) {
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
  style,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterGroups(groups, query), [groups, query]);

  const flatItems = useMemo(
    () => filtered.flatMap((group) => group.items),
    [filtered]
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const selectItem = (item: CommandPaletteItem) => {
    item.onSelect();
    onOpenChange(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (flatItems.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % flatItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + flatItems.length) % flatItems.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = flatItems[activeIndex];
      if (item) selectItem(item);
    }
  };

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
            className="command-palette__input"
            placeholder="Type a command..."
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
            className="command-palette__list"
            style={style}
          >
            {flatItems.length === 0 ? (
              <p className="command-palette__empty">No results.</p>
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
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={cn(
                          'command-palette__item',
                          active && 'dropdown-menu__item--active'
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
