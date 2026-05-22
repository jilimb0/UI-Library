import type { Meta } from '@storybook/react';
import { Heading, Text } from '@ui-construction-library/core';

const meta: Meta = { title: 'Design System/Typography', tags: ['autodocs'] };
export default meta;

const scale = [
  { label: 'Heading 1', as: 'h1' as const, size: 'var(--text-5xl)' },
  { label: 'Heading 2', as: 'h2' as const, size: 'var(--text-3xl)' },
  { label: 'Heading 3', as: 'h3' as const, size: 'var(--text-2xl)' },
  { label: 'Body', as: 'p' as const, size: 'var(--text-base)' },
  { label: 'Small', as: 'p' as const, size: 'var(--text-sm)', muted: true },
] as const;

export const Scale = () => (
  <section className="stack-vertical" style={{ gap: 16 }}>
    {scale.map(({ label, as, size, muted }) => (
      <div key={label} className="stack-vertical" style={{ gap: 4 }}>
        <Text className="field-label">{label}</Text>
        {as.startsWith('h') ? (
          <Heading as={as} style={{ fontSize: size, margin: 0 }}>
            {label} — {size}
          </Heading>
        ) : (
          <Text
            className={muted ? 'field-hint' : undefined}
            style={{ fontSize: size, margin: 0 }}
          >
            {label} — {size}
          </Text>
        )}
      </div>
    ))}
  </section>
);
