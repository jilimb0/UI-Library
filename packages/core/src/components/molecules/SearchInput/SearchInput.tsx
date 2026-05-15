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
      <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
        ⌕
      </span>
      <input
        value={inner}
        onChange={handle}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-9 text-sm"
      />
      {inner ? (
        <button
          type="button"
          onClick={() => {
            setInner('');
            onChange?.('');
          }}
          className="absolute right-2 top-2 rounded p-1 text-slate-500 hover:bg-slate-100"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
