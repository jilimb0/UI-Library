import type { Meta } from '@storybook/react';

const meta: Meta = { title: 'Design System/Spacing' };
export default meta;

const spacingScale = [
  { label: 'space-1', value: 4 },
  { label: 'space-2', value: 8 },
  { label: 'space-3', value: 12 },
  { label: 'space-4', value: 16 },
  { label: 'space-6', value: 24 },
  { label: 'space-8', value: 32 },
  { label: 'space-12', value: 48 },
  { label: 'space-16', value: 64 },
];

export const Scale = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'sans-serif',
    }}
  >
    {spacingScale.map(({ label, value }) => (
      <div
        key={label}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <span style={{ width: 80, fontSize: 12, color: '#6b7280' }}>
          {label}
        </span>
        <div
          style={{
            height: 24,
            width: value,
            background: '#94a3b8',
            borderRadius: 3,
          }}
        />
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{value}px</span>
      </div>
    ))}
  </div>
);
