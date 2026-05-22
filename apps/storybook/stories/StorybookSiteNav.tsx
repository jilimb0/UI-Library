import type { CSSProperties } from 'react';

const DEMO_URL = '../';
const DOCS_URL = '../docs/';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  background: '#ffffff',
};

const linkBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: '10px 14px',
  borderRadius: 999,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 600,
};

export function StorybookSiteNav() {
  return (
    <div style={containerStyle}>
      <div style={{ display: 'grid', gap: 4 }}>
        <strong style={{ fontSize: 14, color: '#111827' }}>
          Cross-site navigation
        </strong>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Move between demo, docs and Storybook sections.
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <a
          href={DEMO_URL}
          style={{ ...linkBaseStyle, background: '#111827', color: '#ffffff' }}
        >
          Open demo
        </a>
        <a
          href={DOCS_URL}
          style={{
            ...linkBaseStyle,
            border: '1px solid #d1d5db',
            background: '#ffffff',
            color: '#111827',
          }}
        >
          Open docs
        </a>
      </div>
    </div>
  );
}
