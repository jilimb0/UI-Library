import type { Meta } from '@storybook/react';
import { Card, Text } from '@ui-construction-library/core';

const meta: Meta = { title: 'Design System/Colors', tags: ['autodocs'] };
export default meta;

const palette = [
  { name: 'Primary', token: '--primary' },
  { name: 'Secondary', token: '--secondary' },
  { name: 'Success', token: '--success' },
  { name: 'Warning', token: '--warning' },
  { name: 'Error', token: '--error' },
  { name: 'Info', token: '--info' },
  { name: 'Background', token: '--background' },
  { name: 'Foreground', token: '--foreground' },
  { name: 'Muted', token: '--muted' },
  { name: 'Muted foreground', token: '--muted-foreground' },
  { name: 'Card', token: '--card' },
  { name: 'Border', token: '--border' },
] as const;

export const Palette = () => (
  <section className="stack-vertical" style={{ gap: 20 }}>
    <Text className="field-hint">
      Semantic colors from the active theme. Use the toolbar to switch light and
      dark mode.
    </Text>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}
    >
      {palette.map(({ name, token }) => (
        <Card key={name} className="surface-panel" style={{ padding: 12 }}>
          <div
            style={{
              height: 64,
              borderRadius: 'var(--radius)',
              background: `var(${token})`,
              border: '1px solid var(--border)',
            }}
          />
          <Text className="field-label" style={{ marginTop: 10 }}>
            {name}
          </Text>
          <Text className="field-hint">{token}</Text>
        </Card>
      ))}
    </div>
  </section>
);
