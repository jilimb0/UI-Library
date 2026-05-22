import type { Meta } from '@storybook/react';
import { Icon, Text } from '@ui-construction-library/core';

const meta: Meta = {
  title: 'Design System/Icons',
  tags: ['autodocs'],
};

export default meta;

const iconNames = [
  'check',
  'x',
  'search',
  'settings',
  'home',
  'user',
  'heart',
  'mail',
  'star',
  'bell',
  'arrow-left',
  'arrow-right',
  'chevron-down',
  'chevron-up',
] as const;

export const Gallery = () => (
  <section className="stack-vertical" style={{ gap: 16 }}>
    <Text className="field-hint">
      Representative icon set from the core package, tinted with theme tokens.
    </Text>
    <div className="inline-cluster" style={{ flexWrap: 'wrap', gap: 20 }}>
      {iconNames.map((name) => (
        <div
          key={name}
          className="stack-vertical"
          style={{ alignItems: 'center', gap: 8, minWidth: 72 }}
        >
          <Icon name={name} size={40} color="var(--primary)" />
          <Text className="field-hint">{name}</Text>
        </div>
      ))}
    </div>
  </section>
);
