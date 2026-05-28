import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Card,
  Heading,
  Link,
  Text,
} from '@ui-construction-library/core';

const flows = [
  {
    name: 'SaaS landing page',
    prompt:
      'Build a conversion-focused landing page for a B2B analytics product.',
    builder: 'Hero, proof strip, pricing teaser, and trial CTA.',
    export: 'Route-aware React shell with deterministic tokens.',
  },
  {
    name: 'Dashboard shell',
    prompt: 'Create an admin dashboard with KPI cards and dense tables.',
    builder: 'Edit mode with tree operations and safe batch changes.',
    export: 'Operational app shell with table and layout primitives.',
  },
  {
    name: 'Settings app',
    prompt: 'Generate account settings with validation and security controls.',
    builder: 'Review mode with protected edits and versioned approvals.',
    export: 'Accessible form-driven handoff artifacts.',
  },
  {
    name: 'Docs page',
    prompt: 'Lay out a docs page with sticky navigation and code examples.',
    builder: 'Stable structure across review and publish modes.',
    export: 'Multi-page route structure with shared theme layer.',
  },
  {
    name: 'Pricing site',
    prompt: 'Design a pricing page with comparison logic and trust signals.',
    builder: 'Publish mode with role gating and version selection.',
    export: 'Static or React export with deterministic pricing sections.',
  },
] as const;

function FlagshipFlows() {
  return (
    <section
      className="stack-vertical"
      style={{ gap: 32, padding: 32, maxWidth: 1120, margin: '0 auto' }}
    >
      <div className="stack-vertical" style={{ gap: 12, maxWidth: 780 }}>
        <Badge>Flagship recipes</Badge>
        <Heading
          as="h1"
          style={{ fontSize: 'var(--text-5xl)', lineHeight: 0.96 }}
        >
          Product proof flows
        </Heading>
        <Text className="field-hint" style={{ fontSize: 'var(--text-lg)' }}>
          The Phase G showcase is not a collection of screenshots. It is a set
          of repeatable stories that move from prompt input to builder state to
          exported artifact.
        </Text>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {flows.map((flow) => (
          <Card
            key={flow.name}
            className="surface-panel"
            style={{ padding: 20 }}
          >
            <div className="stack-vertical" style={{ gap: 12 }}>
              <Text className="field-label">{flow.name}</Text>
              <div className="stack-vertical" style={{ gap: 8 }}>
                <Text className="field-hint">
                  <strong>Prompt</strong> — {flow.prompt}
                </Text>
                <Text className="field-hint">
                  <strong>Builder</strong> — {flow.builder}
                </Text>
                <Text className="field-hint">
                  <strong>Export</strong> — {flow.export}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="surface-panel" style={{ padding: 24 }}>
        <div className="stack-vertical" style={{ gap: 8 }}>
          <Text className="field-label">Design system showcase</Text>
          <Text className="field-hint">
            The component gallery, theme playground, and integration sections
            act as the design-system proof surface that supports the flagship
            flows.
          </Text>
        </div>
      </Card>

      <Card className="surface-panel" style={{ padding: 24 }}>
        <div className="stack-vertical" style={{ gap: 10 }}>
          <Text className="field-label">Public proof</Text>
          <Text className="field-hint">
            Use the demo showcase, docs site, and this Storybook page together
            when presenting the product story.
          </Text>
          <div className="row" style={{ flexWrap: 'wrap', gap: 12 }}>
            <Link href="../">Open demo showcase</Link>
            <Link href="../docs/">Open docs</Link>
          </div>
        </div>
      </Card>
    </section>
  );
}

const meta: Meta<typeof FlagshipFlows> = {
  title: 'Product/Flagship Flows',
  component: FlagshipFlows,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FlagshipFlows>;

export const Default: Story = {};
