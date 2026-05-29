import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CommandPalette,
  CrossSiteNav,
  DataTable,
  DatePicker,
  Heading,
  Input,
  Link,
  Modal,
  Tabs,
  Text,
  ThemeProvider,
  Timeline,
  useTheme,
} from '@ui-construction-library/core';
import { useMemo, useState } from 'react';

declare const __CORE_PACKAGE_VERSION__: string;

const GITHUB_URL = 'https://github.com/jilimb0/UI-Library';
const STORYBOOK_URL = '../storybook/';
const DEMO_URL = '../';
const VERSION = __CORE_PACKAGE_VERSION__;
const INSTALL_COMMAND = 'pnpm add @ui-construction-library/core';
const ROADMAP_URL =
  'https://github.com/jilimb0/UI-Library/blob/main/docs/planning/master-project-plan.md';
const EPICS_URL =
  'https://github.com/jilimb0/UI-Library/blob/main/docs/planning/master-project-plan.md';
const ADR_URL =
  'https://github.com/jilimb0/UI-Library/blob/main/docs/adr/0002-api-and-accessibility-contracts.md';

type CategoryKey = 'atoms' | 'molecules' | 'organisms' | 'templates';

type ComponentDoc = {
  name: string;
  category: CategoryKey;
  description: string;
  props: Array<{ name: string; type: string; description: string }>;
  code: string;
};

const CATEGORY_META: Record<
  CategoryKey,
  {
    title: string;
    description: string;
    inventory: string[];
  }
> = {
  atoms: {
    title: 'Atoms',
    description:
      'Small, reusable primitives for text, form controls and utility UI.',
    inventory: [
      'Avatar',
      'Badge',
      'Button',
      'Checkbox',
      'Code',
      'Divider',
      'Heading',
      'Icon',
      'Image',
      'Input',
      'Kbd',
      'Link',
      'Progress',
      'RadioButton',
      'Select',
      'Skeleton',
      'Spinner',
      'Switch',
      'Tag',
      'Text',
      'TextArea',
    ],
  },
  molecules: {
    title: 'Molecules',
    description: 'Composed controls that solve focused interaction patterns.',
    inventory: [
      'Alert',
      'Breadcrumb',
      'Card',
      'ColorPicker',
      'ComboBox',
      'ContextMenu',
      'DatePicker',
      'Dropdown',
      'Field',
      'FileUpload',
      'MenuItem',
      'OTPInput',
      'Pagination',
      'Popover',
      'Rating',
      'SearchInput',
      'Slider',
      'Stepper',
      'Toast',
      'Tooltip',
    ],
  },
  organisms: {
    title: 'Organisms',
    description: 'Large interface blocks for workflows, data and navigation.',
    inventory: [
      'Accordion',
      'Calendar',
      'CommandPalette',
      'DataTable',
      'Drawer',
      'EmptyState',
      'Form',
      'Kanban',
      'Modal',
      'Navigation',
      'Sidebar',
      'Table',
      'Tabs',
      'Timeline',
      'TreeView',
    ],
  },
  templates: {
    title: 'Templates',
    description:
      'Page-level layouts that accelerate documentation and app shells.',
    inventory: [
      'AuthLayout',
      'DashboardLayout',
      'DocsLayout',
      'MarketingLayout',
      'SidebarLayout',
      'StackedLayout',
    ],
  },
};

const COMPONENTS: ComponentDoc[] = [
  {
    name: 'Button',
    category: 'atoms',
    description:
      'Primary action trigger with variants, sizes and disabled states.',
    props: [
      {
        name: 'variant',
        type: `'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'`,
        description: 'Visual priority and semantic treatment.',
      },
      {
        name: 'size',
        type: `'sm' | 'default' | 'lg'`,
        description: 'Control density across layouts.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Prevents interaction and lowers emphasis.',
      },
    ],
    code: `<Button variant="default">Create project</Button>`,
  },
  {
    name: 'Input',
    category: 'atoms',
    description: 'Single-line text field for forms, filters and search UIs.',
    props: [
      { name: 'label', type: 'string', description: 'Accessible field label.' },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Example input value.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Helper text below the control.',
      },
    ],
    code: `<Input label="Project name" placeholder="Aurora Dashboard" />`,
  },
  {
    name: 'Badge',
    category: 'atoms',
    description: 'Compact metadata token for state, counts and labels.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Inline badge content.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Optional visual overrides.',
      },
    ],
    code: `<Badge>stable</Badge>`,
  },
  {
    name: 'Card',
    category: 'molecules',
    description: 'Grouped surface for related content and actions.',
    props: [
      { name: 'children', type: 'ReactNode', description: 'Card content.' },
      {
        name: 'className',
        type: 'string',
        description: 'Surface and spacing adjustments.',
      },
    ],
    code: `<Card className="p-6"><Heading as="h4">Project</Heading></Card>`,
  },
  {
    name: 'DatePicker',
    category: 'molecules',
    description: 'Calendar-based date selection for forms and filters.',
    props: [
      {
        name: 'selectedDate',
        type: 'Date | null',
        description: 'Currently selected date.',
      },
      {
        name: 'onChange',
        type: '(date: Date | null) => void',
        description: 'Selection callback.',
      },
      {
        name: 'className / style',
        type: 'string / CSSProperties',
        description: 'Optional layout and visual overrides.',
      },
    ],
    code: `<DatePicker selectedDate={value} onChange={setValue} className="w-full" />`,
  },
  {
    name: 'DataTable',
    category: 'organisms',
    description: 'Typed data grid for structured records and sortable views.',
    props: [
      {
        name: 'columns',
        type: 'ColumnDef[]',
        description: 'Column configuration and renderers.',
      },
      {
        name: 'data',
        type: 'Record<string, unknown>[]',
        description: 'Rows rendered by the table.',
      },
    ],
    code: `<DataTable columns={columns} data={rows} />`,
  },
  {
    name: 'CommandPalette',
    category: 'organisms',
    description: 'Keyboard-first command launcher for fast navigation.',
    props: [
      {
        name: 'open',
        type: 'boolean',
        description: 'Controls whether the palette is visible.',
      },
      {
        name: 'items',
        type: 'CommandItem[]',
        description: 'Available actions grouped into sections.',
      },
    ],
    code: `<CommandPalette open={open} items={commands} />`,
  },
  {
    name: 'Timeline',
    category: 'organisms',
    description:
      'Vertical progression view for activity history and milestones.',
    props: [
      {
        name: 'items',
        type: 'TimelineItem[]',
        description: 'Chronological timeline data.',
      },
    ],
    code: `<Timeline items={timelineItems} />`,
  },
];

const TABLE_ROWS = [
  {
    package: '@ui-construction-library/core',
    use: 'Core UI components',
    status: 'stable',
  },
  {
    package: '@ui-construction-library/tokens',
    use: 'Design tokens and semantic theme values',
    status: 'stable',
  },
  {
    package: '@ui-construction-library/react-hook-form',
    use: 'Form integration package',
    status: 'ready',
  },
  {
    package: '@ui-construction-library/icons',
    use: 'Asset and icon layer',
    status: 'stable',
  },
];

const KPI_ROWS = [
  {
    metric: 'Critical a11y regressions',
    target: '0',
    status: 'in progress',
    owner: 'Core Team',
  },
  {
    metric: 'Complex interaction+a11y pass rate',
    target: '>=95%',
    status: 'in progress',
    owner: 'QA + Core Team',
  },
  {
    metric: 'Install to production-ready screen',
    target: '<=30 min',
    status: 'in progress',
    owner: 'DX Team',
  },
  {
    metric: 'Gold integration kits',
    target: '3',
    status: 'in progress',
    owner: 'Integrations Team',
  },
  {
    metric: 'Public quality dashboard',
    target: 'published',
    status: 'in progress',
    owner: 'Platform + Docs',
  },
];

const TIMELINE_ITEMS = [
  {
    id: 'install',
    title: 'Install and wire ThemeProvider',
    description:
      'Start with the public core package and the bundled stylesheet export.',
    timestamp: 'Step 1',
  },
  {
    id: 'compose',
    title: 'Compose product primitives',
    description:
      'Use atoms and molecules to build forms, navigation and cards.',
    timestamp: 'Step 2',
  },
  {
    id: 'scale',
    title: 'Scale with data and patterns',
    description:
      'Adopt DataTable, Timeline, CommandPalette and templates when flows mature.',
    timestamp: 'Step 3',
  },
];

const COMMAND_GROUPS = [
  {
    heading: 'Navigation',
    items: [
      {
        id: 'docs',
        label: 'Open docs',
        onSelect: () => window.location.assign('#reference'),
      },
      {
        id: 'storybook',
        label: 'Open Storybook',
        onSelect: () => window.location.assign(STORYBOOK_URL),
      },
      {
        id: 'demo',
        label: 'Open demo',
        onSelect: () => window.location.assign(DEMO_URL),
      },
    ],
  },
  {
    heading: 'Resources',
    items: [
      {
        id: 'github',
        label: 'View GitHub repository',
        onSelect: () =>
          window.open(GITHUB_URL, '_blank', 'noopener,noreferrer'),
      },
    ],
  },
];

function DocsContent() {
  const { theme, setTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>('atoms');
  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredComponents = useMemo(
    () =>
      COMPONENTS.filter((component) => {
        const matchesCategory = component.category === selectedCategory;
        const search = query.trim().toLowerCase();
        const haystack =
          `${component.name} ${component.description}`.toLowerCase();

        return matchesCategory && (!search || haystack.includes(search));
      }),
    [query, selectedCategory]
  );

  const selectedCategoryMeta = CATEGORY_META[selectedCategory];

  return (
    <div className="docs-shell">
      <header className="docs-topbar">
        <div className="docs-brand">
          <Badge>Docs</Badge>
          <Heading as="h1" className="docs-brand__title">
            UI Construction Library
          </Heading>
          <Text className="docs-brand__meta">Version {VERSION}</Text>
        </div>

        <div className="docs-topbar__actions">
          <Button variant="ghost" onClick={() => setPaletteOpen(true)}>
            Open command menu
          </Button>
          <Link href={DEMO_URL}>
            <Button variant="ghost">Open demo</Button>
          </Link>
          <Link href={STORYBOOK_URL}>
            <Button variant="ghost">Open Storybook</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>
          <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Button>GitHub</Button>
          </Link>
        </div>
      </header>

      <main className="docs-main">
        <CrossSiteNav
          current="docs"
          demoHref={DEMO_URL}
          storybookHref={STORYBOOK_URL}
          docsHref="#"
        />

        <section className="docs-hero">
          <div className="docs-hero__content">
            <div className="docs-badges">
              <Badge>Core</Badge>
              <Badge>Tokens</Badge>
              <Badge>Integrations</Badge>
              <Badge>Theme-ready</Badge>
            </div>
            <Heading as="h2" className="docs-hero__title">
              Documentation for a composable React UI system built for real
              product surfaces.
            </Heading>
            <Text className="docs-hero__description">
              This site should work as both reference documentation and a
              high-confidence entrypoint into the library. It explains the
              package structure, install path, component categories and adoption
              flow in one place.
            </Text>
            <div className="docs-install">
              <Text className="docs-install__label">Install</Text>
              <code>{INSTALL_COMMAND}</code>
            </div>
            <div className="docs-hero__actions">
              <Link href={STORYBOOK_URL}>
                <Button>Open Storybook</Button>
              </Link>
              <Link href={DEMO_URL}>
                <Button variant="outline">Open demo</Button>
              </Link>
            </div>
          </div>

          <Card className="docs-summary-card">
            <Text className="docs-section-label">Why start here</Text>
            <div className="docs-summary-grid">
              <div>
                <Text className="docs-summary-key">Components</Text>
                <Text>
                  Atoms, molecules, organisms and templates mapped to real
                  product UI.
                </Text>
              </div>
              <div>
                <Text className="docs-summary-key">Theme system</Text>
                <Text>
                  Public ThemeProvider and bundled styles export for docs and
                  apps.
                </Text>
              </div>
              <div>
                <Text className="docs-summary-key">Integrations</Text>
                <Text>
                  Separate packages make the library practical beyond static
                  demos.
                </Text>
              </div>
              <div>
                <Text className="docs-summary-key">Adoption</Text>
                <Text>
                  Install, compose primitives, then scale into patterns and
                  templates.
                </Text>
              </div>
            </div>
          </Card>
        </section>

        <section className="docs-grid docs-grid--dual">
          <Card className="docs-panel">
            <Text className="docs-section-label">Navigation map</Text>
            <Breadcrumb
              items={[
                { label: 'Docs', href: '#' },
                {
                  label: selectedCategoryMeta.title,
                  href: `#${selectedCategory}`,
                },
                { label: 'Reference', href: '#reference' },
              ]}
            />
            <Alert variant="default" title="Recommended entry flow">
              Start with installation and ThemeProvider, then move through
              atoms, composed patterns and integration packages.
            </Alert>
          </Card>

          <Card className="docs-panel">
            <Text className="docs-section-label">Try a control</Text>
            <DatePicker
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
            <Text className="docs-panel__meta">
              Interactive examples belong in docs so users can trust the package
              beyond screenshots.
            </Text>
          </Card>
        </section>

        <section className="docs-reference" id="reference">
          <div className="docs-reference__header">
            <div>
              <Text className="docs-section-label">Reference</Text>
              <Heading as="h2">Browse components by category</Heading>
              <Text>
                Filter the documented components, inspect their props and scan
                the broader inventory available in each category.
              </Text>
            </div>
            <div className="docs-reference__controls">
              <Input
                label="Filter components"
                placeholder="Search Button, Input, DataTable…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                Open quickstart
              </Button>
            </div>
          </div>

          <div className="docs-grid docs-grid--sidebar">
            <Card className="docs-panel">
              <Text className="docs-section-label">Categories</Text>
              <div className="docs-category-list">
                {(Object.keys(CATEGORY_META) as CategoryKey[]).map(
                  (category) => {
                    const meta = CATEGORY_META[category];
                    const isActive = category === selectedCategory;

                    return (
                      <button
                        key={category}
                        type="button"
                        className={`docs-category-item ${isActive ? 'docs-category-item--active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <Text className="docs-category-item__title">
                          {meta.title}
                        </Text>
                        <Text className="docs-category-item__description">
                          {meta.description}
                        </Text>
                      </button>
                    );
                  }
                )}
              </div>
            </Card>

            <div className="docs-stack">
              <Card className="docs-panel">
                <Text className="docs-section-label">Inventory</Text>
                <Heading as="h3">{selectedCategoryMeta.title}</Heading>
                <Text>{selectedCategoryMeta.description}</Text>
                <div className="docs-chip-wrap">
                  {selectedCategoryMeta.inventory.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </Card>

              <div className="docs-component-list">
                {filteredComponents.map((component) => (
                  <Card
                    key={component.name}
                    className="docs-panel docs-component-card"
                  >
                    <div className="docs-component-card__header">
                      <div>
                        <Text className="docs-section-label">
                          {component.category}
                        </Text>
                        <Heading as="h3">{component.name}</Heading>
                      </div>
                      <Badge>{component.props.length} props</Badge>
                    </div>
                    <Text>{component.description}</Text>
                    <DataTable
                      columns={[
                        { key: 'name', header: 'Prop' },
                        { key: 'type', header: 'Type' },
                        { key: 'description', header: 'Description' },
                      ]}
                      data={component.props}
                    />
                    <pre className="docs-code-block">
                      <code>{component.code}</code>
                    </pre>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="docs-grid docs-grid--dual">
          <Card className="docs-panel">
            <Text className="docs-section-label">
              Quality dashboard (skeleton)
            </Text>
            <DataTable
              columns={[
                { key: 'metric', header: 'Metric' },
                { key: 'target', header: 'Target' },
                { key: 'status', header: 'Status' },
                { key: 'owner', header: 'Owner' },
              ]}
              data={KPI_ROWS}
            />
            <div className="docs-chip-wrap">
              <Link href={ADR_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  API + A11y ADR
                </Button>
              </Link>
              <Link
                href={ROADMAP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  90-day roadmap
                </Button>
              </Link>
              <Link href={EPICS_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Epics and issue seeds
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="docs-panel">
            <Text className="docs-section-label">Package surface</Text>
            <DataTable
              columns={[
                { key: 'package', header: 'Package' },
                { key: 'use', header: 'Use case' },
                { key: 'status', header: 'Status' },
              ]}
              data={TABLE_ROWS}
            />
          </Card>

          <Card className="docs-panel">
            <Text className="docs-section-label">Adoption timeline</Text>
            <Timeline items={TIMELINE_ITEMS} />
          </Card>
        </section>

        <section className="docs-grid docs-grid--dual">
          <Card className="docs-panel">
            <Text className="docs-section-label">Command palette</Text>
            <Text>
              Keyboard-friendly navigation is part of the design language and
              should be visible in docs, not hidden behind Storybook alone.
            </Text>
            <Button onClick={() => setPaletteOpen(true)}>
              Launch command palette
            </Button>
          </Card>

          <Card className="docs-panel">
            <Text className="docs-section-label">Tabs</Text>
            <Tabs defaultValue="install">
              <Tabs.List>
                <Tabs.Trigger value="install">Install</Tabs.Trigger>
                <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
                <Tabs.Trigger value="integrate">Integrate</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="install">
                <Text>Use the core package and bundled stylesheet export.</Text>
              </Tabs.Content>

              <Tabs.Content value="theme">
                <Text>
                  Wrap app surfaces in ThemeProvider and expose light/dark
                  switching.
                </Text>
              </Tabs.Content>

              <Tabs.Content value="integrate">
                <Text>
                  Add form, router or i18n packages as your app architecture
                  grows.
                </Text>
              </Tabs.Content>
            </Tabs>
          </Card>
        </section>
      </main>

      <CommandPalette
        open={isPaletteOpen}
        onOpenChange={setPaletteOpen}
        groups={COMMAND_GROUPS}
      />

      <Modal open={isModalOpen} onOpenChange={setModalOpen}>
        <Modal.Content title="Quickstart">
          <Modal.Body>
            <div className="docs-stack">
              <Text>1. Install the core package.</Text>
              <Text>2. Import the bundled stylesheet export.</Text>
              <Text>3. Wrap your app with ThemeProvider.</Text>
              <Text>4. Add integration packages when workflow needs grow.</Text>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default function DocsApp() {
  return (
    <ThemeProvider>
      <DocsContent />
    </ThemeProvider>
  );
}
