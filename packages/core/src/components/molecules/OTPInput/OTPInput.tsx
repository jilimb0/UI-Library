import { type CSSProperties, useRef } from 'react';

export interface OTPInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function OTPInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onValueChange,
  className,
  style,
}: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const resolvedValue = value ?? defaultValue;
  const chars = resolvedValue.padEnd(length).slice(0, length).split('');
  const slotKeys = Array.from({ length }, (_, i) => `otp-slot-${i}`);

  return (
    <div className={className ?? 'otp-input'} style={style}>
      {slotKeys.map((slotKey, i) => (
        <input
          key={slotKey}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="otp-input__slot"
          value={chars[i]?.trim() ?? ''}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => {
            const next = resolvedValue
              .padEnd(length)
              .slice(0, length)
              .split('');
            next[i] = e.target.value.replace(/\D/g, '');
            const nextValue = next.join('').trimEnd();
            onChange?.(nextValue);
            onValueChange?.(nextValue);
            if (e.target.value && refs.current[i + 1])
              refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !chars[i] && refs.current[i - 1])
              refs.current[i - 1]?.focus();
          }}
        />
      ))}
    </div>
  );
}
