import { type ChangeEvent, forwardRef, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = '',
      onChange,
      onValueChange,
      debounceMs = 250,
      placeholder = 'Search...',
      className,
      style,
    },
    ref
  ) => {
    const [inner, setInner] = useState(value);
    const debounced = useMemo(() => {
      let t: ReturnType<typeof setTimeout> | undefined;
      return (next: string) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          onChange?.(next);
          onValueChange?.(next);
        }, debounceMs);
      };
    }, [debounceMs, onChange, onValueChange]);

    const handle = (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInner(v);
      debounced(v);
    };

    return (
      <div className={cn('relative w-full', className)} style={style}>
        <span
          className="field-hint"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          ⌕
        </span>
        <input
          ref={ref}
          value={inner}
          onChange={handle}
          placeholder={placeholder}
          className="search-input"
        />
        {inner ? (
          <button
            type="button"
            onClick={() => {
              setInner('');
              onChange?.('');
              onValueChange?.('');
            }}
            className="button button--ghost button--sm"
          >
            ×
          </button>
        ) : null}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
