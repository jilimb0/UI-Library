import {
  Badge,
  Button,
  Card,
  Divider,
  Heading,
  Link,
  Spinner,
  Text,
  ThemeProvider,
  useTheme,
} from '@ui-construction-library/core';

const NAV_LINKS = [
  { label: 'Components', href: '#components' },
  { label: 'Playground', href: '/playground' },
  { label: 'GitHub', href: 'https://github.com', external: true },
];

const COMPONENT_CATEGORIES = [
  {
    title: 'Atoms',
    count: 22,
    desc: 'Button, Input, Badge, Heading, Icon, Link…',
    href: '#atoms',
  },
  {
    title: 'Molecules',
    count: 20,
    desc: 'Card, DatePicker, Tooltip, Tabs…',
    href: '#molecules',
  },
  {
    title: 'Organisms',
    count: 15,
    desc: 'Modal, DataTable, Sidebar, Navbar…',
    href: '#organisms',
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
}

function DocsHeader() {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Heading as="h1" className="!text-xl !mb-0 font-bold">
              UI Library
            </Heading>
            <Badge>docs</Badge>
          </div>

          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="text-center py-24 px-4">
      <Badge className="mb-6">v1.0.0 — stable</Badge>
      <Heading as="h2" className="text-5xl font-bold mb-6 max-w-3xl mx-auto">
        Documentation
      </Heading>
      <Text className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10">
        Welcome to UI Library documentation. Explore all components, see live
        examples, and read detailed usage instructions.
      </Text>
      <div className="flex justify-center gap-4 flex-wrap">
        <Button size="lg">Browse Components →</Button>
        <Button variant="outline" size="lg">
          View on GitHub
        </Button>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 mb-16">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Components', value: '57+' },
          { label: 'Test Coverage', value: '96%' },
          { label: 'TypeScript', value: '100%' },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <Heading as="h3" className="text-4xl font-bold mb-1">
              {stat.value}
            </Heading>
            <Text className="text-sm text-[var(--muted-foreground)]">
              {stat.label}
            </Text>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ComponentsSection() {
  return (
    <section id="components" className="max-w-4xl mx-auto px-4 mb-24">
      <Heading as="h2" className="text-3xl font-bold mb-2">
        Components
      </Heading>
      <Text className="text-[var(--muted-foreground)] mb-8">
        Organised into atoms, molecules, and organisms following Atomic Design.
      </Text>
      <Divider className="mb-8" />

      <div className="grid sm:grid-cols-3 gap-4">
        {COMPONENT_CATEGORIES.map((cat) => (
          <Link key={cat.title} href={cat.href} className="no-underline">
            <Card className="p-6 h-full flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <Heading as="h4" className="font-semibold !mb-0">
                  {cat.title}
                </Heading>
                <Badge>{cat.count}</Badge>
              </div>
              <Text className="text-sm text-[var(--muted-foreground)] flex-1">
                {cat.desc}
              </Text>
              <Text className="text-sm text-[var(--primary)] font-medium">
                View all →
              </Text>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function GettingStartedSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 mb-24">
      <Heading as="h2" className="text-3xl font-bold mb-2">
        Getting Started
      </Heading>
      <Text className="text-[var(--muted-foreground)] mb-8">
        Install and set up the library in minutes.
      </Text>
      <Divider className="mb-8" />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 flex flex-col gap-4">
          <Heading as="h3" className="text-xl font-semibold !mb-0">
            Install
          </Heading>
          <Text className="text-[var(--muted-foreground)] text-sm">
            Add the package to your project:
          </Text>
          <pre className="bg-[var(--muted)] rounded-lg p-4 text-sm font-mono text-[var(--foreground)] overflow-x-auto">
            {`pnpm add @ui-construction-library/core`}
          </pre>
        </Card>

        <Card className="p-8 flex flex-col gap-4">
          <Heading as="h3" className="text-xl font-semibold !mb-0">
            Import
          </Heading>
          <Text className="text-[var(--muted-foreground)] text-sm">
            Wrap your app with ThemeProvider:
          </Text>
          <pre className="bg-[var(--muted)] rounded-lg p-4 text-sm font-mono text-[var(--foreground)] overflow-x-auto">
            {`import { ThemeProvider } from '@ui-construction-library/core';

<ThemeProvider>
  <App />
</ThemeProvider>`}
          </pre>
        </Card>
      </div>
    </section>
  );
}

function DocsApp() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <DocsHeader />

        <main>
          <HeroSection />
          <StatsSection />
          <ComponentsSection />
          <GettingStartedSection />
        </main>

        <footer className="border-t border-[var(--border)] py-8">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center flex-wrap gap-4">
            <Text className="text-sm text-[var(--muted-foreground)]">
              © 2026 UI Construction Library
            </Text>
            <div className="flex items-center gap-2">
              <Spinner size={16} />
              <Text className="text-sm text-[var(--muted-foreground)]">
                Loading components…
              </Text>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default DocsApp;
