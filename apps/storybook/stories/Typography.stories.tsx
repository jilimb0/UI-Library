import type { Meta } from '@storybook/react-vite';
import { Heading, Text } from '@ui-construction-library/core';

const meta: Meta = { title: 'Design System/Typography', tags: ['autodocs'] };
export default meta;

const scale = [
  { label: 'Heading 1', as: 'h1' as const, size: 'var(--text-5xl)' },
  { label: 'Heading 2', as: 'h2' as const, size: 'var(--text-3xl)' },
  { label: 'Heading 3', as: 'h3' as const, size: 'var(--text-2xl)' },
  { label: 'Body', as: 'p' as const, size: 'var(--text-base)' },
  { label: 'Small', as: 'p' as const, size: 'var(--text-sm)', muted: true },
] as const satisfies ReadonlyArray<{
  label: string;
  as: 'h1' | 'h2' | 'h3' | 'p';
  size: string;
  muted?: boolean;
}>;

export const Scale = () => (
  <section className="stack-vertical" style={{ gap: 16 }}>
    {scale.map((item) => (
      <div key={item.label} className="stack-vertical" style={{ gap: 4 }}>
        <Text className="field-label">{item.label}</Text>
        {item.as.startsWith('h') ? (
          <Heading as={item.as} style={{ fontSize: item.size, margin: 0 }}>
            {item.label} — {item.size}
          </Heading>
        ) : (
          <Text
            className={'muted' in item && item.muted ? 'field-hint' : undefined}
            style={{ fontSize: item.size, margin: 0 }}
          >
            {item.label} — {item.size}
          </Text>
        )}
      </div>
    ))}
  </section>
);
