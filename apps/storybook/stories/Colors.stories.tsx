import type { Meta } from '@storybook/react';

const DEMO_URL = '../';
const DOCS_URL = '../docs/';

const meta: Meta = { title: 'Design System/Colors' };
export default meta;

const colors = [
  { name: 'Primary Blue', value: '#2563eb' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Rose', value: '#dc2626' },
];

export const Palette = () => (
  <div style={{ display: 'grid', gap: 20 }}>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        background: '#ffffff',
      }}
    >
      <div style={{ display: 'grid', gap: 4 }}>
        <strong style={{ fontSize: 14, color: '#111827' }}>
          Cross-site navigation
        </strong>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Jump to the public demo or documentation from this Storybook page.
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <a
          href={DEMO_URL}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
            padding: '10px 14px',
            borderRadius: 999,
            background: '#111827',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Open demo
        </a>
        <a
          href={DOCS_URL}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
            padding: '10px 14px',
            borderRadius: 999,
            border: '1px solid #d1d5db',
            background: '#ffffff',
            color: '#111827',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Open docs
        </a>
      </div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}
    >
      {colors.map((c) => (
        <div
          key={c.name}
          style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}
        >
          <div style={{ height: 64, borderRadius: 6, background: c.value }} />
          <p style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
            {c.name}
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>{c.value}</p>
        </div>
      ))}
    </div>
  </div>
);
