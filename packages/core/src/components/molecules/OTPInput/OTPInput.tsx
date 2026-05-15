import { useRef } from 'react';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = value.padEnd(length).slice(0, length).split('');
  const slotKeys = Array.from({ length }, (_, i) => `otp-slot-${i}`);

  return (
    <div className="flex gap-2">
      {slotKeys.map((slotKey, i) => (
        <input
          key={slotKey}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={chars[i]?.trim() ?? ''}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => {
            const next = value.padEnd(length).slice(0, length).split('');
            next[i] = e.target.value.replace(/\D/g, '');
            onChange(next.join('').trimEnd());
            if (e.target.value && refs.current[i + 1])
              refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !chars[i] && refs.current[i - 1])
              refs.current[i - 1]?.focus();
          }}
          className="h-10 w-10 rounded border border-slate-300 text-center text-lg"
        />
      ))}
    </div>
  );
}
