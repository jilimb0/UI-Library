import type { CSSProperties, ReactNode } from 'react';

export interface HandoffPulseProps {
  active?: boolean;
  color?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function HandoffPulse({
  active = false,
  color = 'var(--ucl-color-primary, #3b82f6)',
  className = '',
  style,
  children,
}: HandoffPulseProps) {
  const pulseStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <span
      className={`ucl-handoff-pulse ${active ? 'ucl-handoff-pulse--active' : ''} ${className}`.trim()}
      style={pulseStyle}
      aria-hidden="true"
    >
      {active && (
        <span
          className="ucl-handoff-pulse__ring"
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '9999px',
            border: `2px solid ${color}`,
            opacity: 0.75,
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </span>
  );
}
