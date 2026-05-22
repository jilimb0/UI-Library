import type { Meta } from '@storybook/react';
import { StorybookSiteNav } from './StorybookSiteNav';

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
    <StorybookSiteNav />

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
