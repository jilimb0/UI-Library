import { type ChangeEvent, useMemo, useState } from 'react';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

export function SearchInput({
  value = '',
  onChange,
  debounceMs = 250,
  placeholder = 'Search...',
}: SearchInputProps) {
  const [inner, setInner] = useState(value);
  const debounced = useMemo(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    return (next: string) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => onChange?.(next), debounceMs);
    };
  }, [debounceMs, onChange]);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInner(v);
    debounced(v);
  };

  return (
    <div className="relative w-full">
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
          }}
          className="button button--ghost button--sm"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
