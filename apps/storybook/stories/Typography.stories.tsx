import type { Meta } from '@storybook/react';

const meta: Meta = { title: 'Design System/Typography' };
export default meta;

export const Scale = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      fontFamily: 'sans-serif',
    }}
  >
    <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>Heading 1</h1>
    <h2 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Heading 2</h2>
    <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Heading 3</h3>
    <p style={{ fontSize: 16, margin: 0, color: '#374151' }}>
      Body text — regular paragraph
    </p>
    <p style={{ fontSize: 14, margin: 0, color: '#6b7280' }}>
      Small text — secondary info
    </p>
  </div>
);
