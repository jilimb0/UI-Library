import {
  Badge,
  Button,
  Card,
  Heading,
  Text,
} from '@ui-construction-library/core';
import { SectionIntro } from './SectionIntro';

const GITHUB_URL = 'https://github.com/jilimb0/UI-Library';
const DOCS_URL = './docs/';
const STORYBOOK_URL = './storybook/';
const INSTALL_COMMAND = 'pnpm add @ui-construction-library/core';

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

const heroProofPoints = [
  'ThemeProvider with runtime light/dark switching',
  'Typed primitives, forms, data and motion utilities',
  'Monorepo packages for tokens, icons and integrations',
] as const;

export function HeroSection() {
  return (
    <section id="overview" className="hero-shell">
      <div className="hero-copy stack">
        <div className="row wrap-row">
          <Badge>Core</Badge>
          <Badge>Tokens</Badge>
          <Badge>Integrations</Badge>
        </div>
        <Heading as="h2" className="hero-title">
          A composable React UI system for shipping polished product surfaces.
        </Heading>
        <Text className="hero-description">
          UI Construction Library gives teams a typed component core, shared
          theme tokens and real integration packages for forms, routing and data
          workflows.
        </Text>
        <div className="hero-install stack-tight">
          <Text className="command-label">Install</Text>
          <code>{INSTALL_COMMAND}</code>
        </div>
        <div className="hero-proof-list stack-tight">
          {heroProofPoints.map((item) => (
            <div key={item} className="hero-proof-item">
              <span
                className="hero-proof-bullet"
                style={{ marginRight: '8px' }}
              >
                ✓
              </span>
              <Text>{item}</Text>
            </div>
          ))}
        </div>
        <div className="hero-cta wrap-row">
          <Button as="a" href={DOCS_URL} size="lg">
            Open docs
          </Button>
          <Button as="a" href={STORYBOOK_URL} variant="ghost" size="lg">
            Open Storybook
          </Button>
          <Button
            as="a"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="lg"
          >
            View GitHub
          </Button>
        </div>
      </div>

      <Card className="hero-card">
        <SectionIntro
          eyebrow="Why this library"
          title="A system for shipping product surfaces, not only isolated primitives"
          description="The monorepo ties together tokens, icons, core UI, runtime theming and framework integrations. That makes the public demo useful in sales calls, evaluation flows and internal adoption discussions."
        />
        <div className="hero-highlights-grid">
          {packageHighlights.map((item) => (
            <div key={item.label} className="hero-highlight-item">
              <Text className="hero-stat-label">{item.label}</Text>
              <Text className="hero-stat-value">{item.value}</Text>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
