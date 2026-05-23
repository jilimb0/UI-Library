import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Card,
  CrossSiteNav,
  Heading,
  Text,
} from '@ui-construction-library/core';

const highlights = [
  {
    title: 'Components',
    description: 'Atoms, molecules, organisms and templates for product UI.',
  },
  {
    title: 'Themes',
    description: 'ThemeProvider and token-based light/dark foundations.',
  },
  {
    title: 'Documentation',
    description: 'Reference stories that support docs and adoption.',
  },
  {
    title: 'Validation',
    description: 'A11y checks and visual review via Storybook and Chromatic.',
  },
] as const;

function Introduction() {
  return (
    <section className="stack-vertical" style={{ gap: 32 }}>
      <CrossSiteNav current="storybook" demoHref="../" docsHref="../docs/" />
      <div className="stack-vertical" style={{ gap: 12, maxWidth: 760 }}>
        <Badge>Public entrypoint</Badge>
        <Heading
          as="h1"
          style={{ fontSize: 'var(--text-5xl)', lineHeight: 0.96 }}
        >
          UI Construction Library Storybook
        </Heading>
        <Text className="field-hint" style={{ fontSize: 'var(--text-lg)' }}>
          Explore the component system, token stories and public design language
          that power the showcase demo and documentation site.
        </Text>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {highlights.map(({ title, description }) => (
          <Card key={title} className="surface-panel" style={{ padding: 20 }}>
            <Text className="field-label">{title}</Text>
            <Text className="field-hint">{description}</Text>
          </Card>
        ))}
      </div>
    </section>
  );
}

const meta: Meta<typeof Introduction> = {
  title: 'Design System/Introduction',
  component: Introduction,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Introduction>;

export const Default: Story = {};
