import type { Meta } from '@storybook/react';
import { Text } from '@ui-construction-library/core';

const meta: Meta = { title: 'Design System/Spacing', tags: ['autodocs'] };
export default meta;

const spacingScale = [
  '0',
  '0-5',
  '1',
  '2',
  '3',
  '4',
  '6',
  '8',
  '12',
  '16',
] as const;

export const Scale = () => (
  <section className="stack-vertical" style={{ gap: 16 }}>
    <Text className="field-hint">
      Spacing tokens from the design system (`--spacing-*`).
    </Text>
    {spacingScale.map((step) => {
      const token = `--spacing-${step}`;
      return (
        <div key={step} className="inline-cluster" style={{ gap: 12 }}>
          <Text className="field-label" style={{ minWidth: 96 }}>
            {token}
          </Text>
          <div
            style={{
              height: 24,
              width: `var(${token})`,
              minWidth: 4,
              background: 'var(--primary)',
              borderRadius: 4,
              opacity: 0.65,
            }}
          />
        </div>
      );
    })}
  </section>
);
