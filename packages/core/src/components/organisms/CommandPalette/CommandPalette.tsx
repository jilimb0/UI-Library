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
import { Kbd } from '../../atoms/Kbd';
import {
  type ParsedTerminalCommand,
  parseTerminalCommand,
} from './commandGrammar';

export interface CommandPaletteItem {
  id: string;
  label: string;
  keywords?: string[];
  icon?: ReactNode;
  shortcut?: string;
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
  onExecuteCommand?: (parsed: ParsedTerminalCommand) => void;
  onPreviewItem?: (item: CommandPaletteItem) => void;
  knownMnemonics?: readonly string[];
  shortcutHint?: string;
}

export interface UseGlobalCommandShortcutOptions {
  onOpen: () => void;
  triggers?: readonly ('/' | '`' | 'Mod+k' | (string & {}))[];
  enabled?: boolean;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || typeof HTMLElement === 'undefined') return false;
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return true;
  }
  if (target.isContentEditable) return true;
  if (target.getAttribute('contenteditable') === 'true') return true;
  return Boolean(target.closest('[contenteditable="true"]'));
}

export function useGlobalCommandShortcut({
  onOpen,
  triggers = ['/', '`', 'Mod+k'],
  enabled = true,
}: UseGlobalCommandShortcutOptions): void {
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const triggersKey = triggers.join('\0');

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      !enabled
    ) {
      return;
    }

    const triggerList = triggersKey ? triggersKey.split('\0') : [];
    const hasModK = triggerList.some((t) => t.toLowerCase() === 'mod+k');
    const plainTriggerSet = new Set(
      triggerList.filter((t) => t.toLowerCase() !== 'mod+k')
    );

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (
        hasModK &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        onOpenRef.current();
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (
        isEditableElement(document.activeElement) ||
        isEditableElement(event.target)
      ) {
        return;
      }

      if (plainTriggerSet.has(event.key)) {
        event.preventDefault();
        onOpenRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, triggersKey]);
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
  onExecuteCommand,
  onPreviewItem,
  knownMnemonics,
  shortcutHint,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterGroups(groups, query), [groups, query]);

  const filteredFlatItems = useMemo(
    () => filtered.flatMap((g) => g.items),
    [filtered]
  );

  const parsedCommand = useMemo(
    () => parseTerminalCommand(query, knownMnemonics),
    [query, knownMnemonics]
  );

  const selectItem = useCallback(
    (item: CommandPaletteItem) => {
      item.onSelect();
      onOpenChange(false);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      if (
        typeof window !== 'undefined' &&
        typeof requestAnimationFrame === 'function'
      ) {
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }
  }, [open]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (
          onExecuteCommand &&
          (parsedCommand.mode !== 'search' ||
            (filteredFlatItems.length === 0 && query.trim().length > 0))
        ) {
          onExecuteCommand(parsedCommand);
          onOpenChange(false);
          return;
        }
        const item = filteredFlatItems[activeIndex];
        if (item) selectItem(item);
        return;
      }

      if (filteredFlatItems.length === 0) return;

      let nextIndex = -1;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        nextIndex = (activeIndex + 1) % filteredFlatItems.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nextIndex =
          (activeIndex - 1 + filteredFlatItems.length) %
          filteredFlatItems.length;
      } else if (event.key === 'Home') {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        nextIndex = filteredFlatItems.length - 1;
      }

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        const nextItem = filteredFlatItems[nextIndex];
        if (nextItem) {
          onPreviewItem?.(nextItem);
        }
      }
    },
    [
      filteredFlatItems,
      activeIndex,
      selectItem,
      onPreviewItem,
      onExecuteCommand,
      parsedCommand,
      query,
      onOpenChange,
    ]
  );

  let itemOffset = 0;
  const activeItem = filteredFlatItems[activeIndex];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-backdrop" />
        <Dialog.Content className="command-palette">
          <div className="command-palette__input-wrap">
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded
              aria-controls="command-palette-list"
              aria-autocomplete="list"
              aria-activedescendant={
                activeItem ? `command-item-${activeItem.id}` : undefined
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
            {shortcutHint ? (
              <Kbd className="command-palette__kbd">{shortcutHint}</Kbd>
            ) : null}
          </div>

          {parsedCommand.mode !== 'search' ? (
            <div className="command-palette__grammar-hint" aria-live="polite">
              <span className="command-palette__grammar-label">
                {parsedCommand.mode === 'mnemonic'
                  ? `${parsedCommand.subject ? `${parsedCommand.subject} · ` : ''}${parsedCommand.mnemonic}`
                  : `${parsedCommand.expression?.left} ${parsedCommand.expression?.operator} ${parsedCommand.expression?.right}`}
              </span>
              <Kbd className="command-palette__kbd">Enter &lt;GO&gt;</Kbd>
            </div>
          ) : null}

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
                        <span className="command-palette__item-label">
                          {item.label}
                        </span>
                        {item.shortcut ? (
                          <Kbd className="command-palette__kbd">
                            {item.shortcut}
                          </Kbd>
                        ) : null}
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
