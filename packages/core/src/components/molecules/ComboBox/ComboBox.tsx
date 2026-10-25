import {
  type CSSProperties,
  type KeyboardEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

export interface ComboBoxOption {
  value: string;
  label: string;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  /** Accessible label for the combobox input. */
  label?: string;
  disabled?: boolean;
}

/**
 * Combobox — WAI-ARIA 1.2 combobox pattern (list autocomplete).
 * - role="combobox" on the input
 * - role="listbox" on the dropdown (div element per APG)
 * - role="option" on each item (div element per APG)
 * - aria-activedescendant tracks the focused option
 * - Keyboard: ArrowDown/Up navigate, Home/End to first/last,
 *   Enter selects, Escape closes
 */
export function ComboBox({
  options,
  value,
  onChange,
  onValueChange,
  placeholder = 'Search...',
  className,
  style,
  label,
  disabled = false,
}: ComboBoxProps) {
  const uid = useId();
  const inputId = `${uid}-input`;
  const listboxId = `${uid}-listbox`;

  const emitChange = (nextValue: string) => {
    onValueChange?.(nextValue);
    onChange?.(nextValue);
  };

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      ),
    [options, query]
  );

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
  const activeOptionId =
    activeIndex >= 0 && filtered[activeIndex]
      ? `${uid}-option-${activeIndex}`
      : undefined;

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  };

  const closeList = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const select = (option: ComboBoxOption) => {
    emitChange(option.value);
    setQuery('');
    closeList();
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        event.preventDefault();
        openList();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setActiveIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
        break;
      }
      case 'Home': {
        event.preventDefault();
        setActiveIndex(0);
        break;
      }
      case 'End': {
        event.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          select(filtered[activeIndex]);
        }
        break;
      }
      case 'Escape': {
        event.preventDefault();
        closeList();
        break;
      }
      case 'Tab': {
        closeList();
        break;
      }
    }
  };

  return (
    <div className={cn('relative w-full', className)} style={style}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        value={open ? query : selectedLabel}
        onFocus={openList}
        onChange={(e) => {
          setOpen(true);
          setQuery(e.target.value);
          setActiveIndex(0);
        }}
        onBlur={(e) => {
          if (!e.relatedTarget?.closest(`#${listboxId}`)) {
            closeList();
          }
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="input"
      />

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label ?? 'Options'}
          tabIndex={-1}
          className="dropdown-menu absolute z-20 max-h-56 w-full overflow-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filtered.length === 0 ? (
            <div
              role="option"
              aria-selected={false}
              tabIndex={-1}
              className="dropdown-menu__item field-hint"
            >
              No results
            </div>
          ) : (
            filtered.map((option, index) => (
              <div
                key={option.value}
                id={`${uid}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                className={cn(
                  'dropdown-menu__item',
                  index === activeIndex && 'dropdown-menu__item--active',
                  option.value === value && 'dropdown-menu__item--selected'
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(option)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select(option);
                  }
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
