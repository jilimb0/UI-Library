import { type KeyboardEvent, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface ComboBoxOption {
  value: string;
  label: string;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ComboBox({
  options,
  value,
  onValueChange,
  placeholder = 'Search...',
  className,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filtered = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      ),
    [options, query]
  );

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((idx) =>
        Math.min(idx + 1, Math.max(filtered.length - 1, 0))
      );
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((idx) => Math.max(idx - 1, 0));
    }
    if (event.key === 'Enter' && filtered[highlightedIndex]) {
      event.preventDefault();
      onValueChange?.(filtered[highlightedIndex].value);
      setQuery('');
      setOpen(false);
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <input
        value={open ? query : selectedLabel}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setOpen(true);
          setQuery(e.target.value);
          setHighlightedIndex(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="input"
      />

      {open ? (
        <ul className="dropdown-menu absolute z-20 max-h-56 w-full overflow-auto">
          {filtered.length === 0 ? (
            <li className="dropdown-menu__item field-hint">No results</li>
          ) : (
            filtered.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onValueChange?.(option.value);
                    setQuery('');
                    setOpen(false);
                  }}
                  className={cn(
                    'dropdown-menu__item w-full text-left',
                    index === highlightedIndex && 'dropdown-menu__item--active'
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
