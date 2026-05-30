import { Card, Heading, Text } from '@ui-construction-library/core';
import { SectionIntro } from './SectionIntro';

const packageHighlights = [
  { label: 'Core UI', value: '40+ primitives and composed components' },
  {
    label: 'Integrations',
    value: 'React Hook Form, TanStack and i18n packages',
  },
  {
    label: 'Themes',
    value: 'Tokens, ThemeProvider and light/dark runtime switching',
  },
  { label: 'Tooling', value: 'Monorepo, Storybook, tests and typed exports' },
] as const;

export function ArchitectureSection() {
  return (
    <section className="stack">
      <SectionIntro
        eyebrow="Package system"
        title="Monorepo structure designed for real product usage"
        description="The public surface is backed by separate packages for core UI, design tokens, icons and framework integrations. That makes it easier to scale adoption without forcing everything through one package."
      />
      <div className="feature-grid feature-grid--three">
        {packageHighlights.map((item) => (
          <Card key={item.label} className="panel compact-panel">
            <Text className="eyebrow">{item.label}</Text>
            <Heading as="h3" className="card-title">
              {item.value}
            </Heading>
          </Card>
        ))}
      </div>
    </section>
  );
}
