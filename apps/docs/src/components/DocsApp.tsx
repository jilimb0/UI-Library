import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CommandPalette,
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
const VERSION = __CORE_PACKAGE_VERSION__;

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
        type: `'sm' | 'md' | 'lg'`,
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
    ],
    code: `<DatePicker selectedDate={date} onChange={setDate} />`,
  },
  {
    name: 'Tooltip',
    category: 'molecules',
    description: 'Contextual helper text for dense interfaces.',
    props: [
      { name: 'content', type: 'ReactNode', description: 'Tooltip body.' },
      { name: 'children', type: 'ReactNode', description: 'Trigger element.' },
    ],
    code: `<Tooltip content="Search components"><Button variant="outline">?</Button></Tooltip>`,
  },
  {
    name: 'Modal',
    category: 'organisms',
    description: 'Compound dialog API for confirmations and focused workflows.',
    props: [
      {
        name: 'open',
        type: 'boolean',
        description: 'Controls dialog visibility.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'State sync callback.',
      },
    ],
    code: `<Modal open={open} onOpenChange={setOpen}><Modal.Content>...</Modal.Content></Modal>`,
  },
  {
    name: 'DataTable',
    category: 'organisms',
    description: 'Sortable table for operational dashboards and admin panels.',
    props: [
      { name: 'data', type: 'T[]', description: 'Array of row objects.' },
      {
        name: 'columns',
        type: 'Column<T>[]',
        description: 'Column definitions and renderers.',
      },
      {
        name: 'pageSize',
        type: 'number',
        description: 'Rows rendered per page.',
      },
    ],
    code: `<DataTable data={rows} columns={columns} pageSize={5} />`,
  },
  {
    name: 'Tabs',
    category: 'organisms',
    description: 'Structured switching between related panels and states.',
    props: [
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initially selected tab.',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        description: 'Selection callback.',
      },
    ],
    code: `<Tabs defaultValue="overview">...</Tabs>`,
  },
  {
    name: 'AuthLayout',
    category: 'templates',
    description:
      'Focused authentication shell for sign in, sign up and password recovery flows.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Auth form content.',
      },
      {
        name: 'aside',
        type: 'ReactNode',
        description: 'Optional branded supporting panel.',
      },
    ],
    code: `<AuthLayout aside={<PromoPanel />}>{form}</AuthLayout>`,
  },
  {
    name: 'DashboardLayout',
    category: 'templates',
    description: 'High-density app layout for admin tools and analytics views.',
    props: [
      { name: 'header', type: 'ReactNode', description: 'Top app bar.' },
      { name: 'sidebar', type: 'ReactNode', description: 'Primary nav rail.' },
      { name: 'children', type: 'ReactNode', description: 'Main page canvas.' },
    ],
    code: `<DashboardLayout header={<Header />} sidebar={<Sidebar />}>{content}</DashboardLayout>`,
  },
  {
    name: 'DocsLayout',
    category: 'templates',
    description: 'Documentation shell with nav, content rail and metadata.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Rendered page content.',
      },
      {
        name: 'sidebar',
        type: 'ReactNode',
        description: 'Navigation or table of contents.',
      },
    ],
    code: `<DocsLayout sidebar={<Sidebar />}>{content}</DocsLayout>`,
  },
  {
    name: 'MarketingLayout',
    category: 'templates',
    description:
      'Landing-page oriented shell for product pages and marketing flows.',
    props: [
      {
        name: 'header',
        type: 'ReactNode',
        description: 'Brand and navigation row.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        description: 'Closing CTA or site footer.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Hero and page sections.',
      },
    ],
    code: `<MarketingLayout header={<Header />} footer={<Footer />}>{content}</MarketingLayout>`,
  },
  {
    name: 'SidebarLayout',
    category: 'templates',
    description:
      'Classic rail-and-content composition for settings and documentation.',
    props: [
      {
        name: 'sidebar',
        type: 'ReactNode',
        description: 'Persistent navigation rail.',
      },
      { name: 'children', type: 'ReactNode', description: 'Content viewport.' },
    ],
    code: `<SidebarLayout sidebar={<Sidebar />}>{content}</SidebarLayout>`,
  },
  {
    name: 'StackedLayout',
    category: 'templates',
    description:
      'Vertical layout with consistent page rhythm for content-heavy screens.',
    props: [
      {
        name: 'header',
        type: 'ReactNode',
        description: 'Optional top section.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Stacked page content.',
      },
    ],
    code: `<StackedLayout header={<PageHeader />}>{content}</StackedLayout>`,
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
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Heading as="h1" className="!mb-0 !text-xl font-bold">
            UI Library
          </Heading>
          <Badge>docs</Badge>
          <Badge>v{VERSION}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <Link href="#overview" className="text-sm">
            Overview
          </Link>
          <Link href="#components" className="text-sm">
            Components
          </Link>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            GitHub
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function DocsSidebar({ activeId }: { activeId: string }) {
  const groups = useMemo(() => {
    return Object.entries(CATEGORY_META).map(([key, meta]) => ({
      key: key as CategoryKey,
      meta,
      items: meta.inventory,
    }));
  }, []);

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 lg:block">
      <div className="mb-4">
        <Text className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          Navigation
        </Text>
      </div>
      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Text className="text-sm font-semibold">{group.meta.title}</Text>
              <Badge>{group.items.length}</Badge>
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeId === item;
                return (
                  <a
                    key={item}
                    href={`#${item}`}
                    className={`block rounded-md px-3 py-2 text-sm no-underline transition-colors ${
                      isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                    }`}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function HeroSection() {
  return (
    <section
      id="overview"
      className="rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-12 shadow-sm sm:px-8"
    >
      <Badge className="mb-4">Production-ready component docs</Badge>
      <Heading
        as="h2"
        className="mb-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Documentation for atoms, molecules, organisms and templates.
      </Heading>
      <Text className="max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg">
        Browse every category from a persistent sidebar, inspect component
        props, copy starter snippets and preview live examples without leaving
        the page.
      </Text>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#components">
          <Button size="lg">Browse Components →</Button>
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="lg">
            View on GitHub
          </Button>
        </a>
      </div>
    </section>
  );
}

function CategoryCards() {
  const categories = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    key: key as CategoryKey,
    ...meta,
    count: meta.inventory.length,
  }));

  return (
    <section id="components" className="space-y-4">
      <div>
        <Heading as="h2" className="mb-2 text-3xl font-bold">
          Components
        </Heading>
        <Text className="text-[var(--muted-foreground)]">
          Real categories rendered from the current library structure, including
          all six templates.
        </Text>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.key} className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <Heading as="h3" className="!mb-0 text-lg font-semibold">
                {category.title}
              </Heading>
              <Badge>{category.count}</Badge>
            </div>
            <Text className="text-sm text-[var(--muted-foreground)]">
              {category.description}
            </Text>
            <Text className="text-xs text-[var(--muted-foreground)]">
              {category.inventory.join(', ')}
            </Text>
            <a
              href={`#section-${category.key}`}
              className="mt-auto text-sm font-medium text-[var(--primary)] no-underline"
            >
              Jump to section →
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DocsSearch() {
  const [open, setOpen] = useState(false);
  const searchGroups = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    heading: meta.title,
    items: meta.inventory.map((componentName) => ({
      id: componentName,
      label: componentName,
      keywords: [key, meta.description],
      onSelect: () => {
        window.location.hash = componentName;
      },
    })),
  }));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div>
          <Heading as="h3" className="!mb-1 text-xl font-semibold">
            Search components
          </Heading>
          <Text className="text-sm text-[var(--muted-foreground)]">
            Command-style lookup grouped by category and powered by the library
            itself.
          </Text>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open Search
        </Button>
      </div>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={searchGroups}
      />
    </section>
  );
}

function ExamplePreview({ component }: { component: ComponentDoc }) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  switch (component.name) {
    case 'Button':
      return (
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      );
    case 'Input':
      return (
        <Input
          label="Project name"
          placeholder="Aurora Dashboard"
          description="Used for naming dashboards, kits and docs pages."
        />
      );
    case 'Badge':
      return (
        <div className="flex gap-3">
          <Badge>stable</Badge>
          <Badge>beta</Badge>
        </div>
      );
    case 'Card':
      return (
        <Card className="p-5">
          <Heading as="h4" className="!mb-1 text-lg font-semibold">
            Billing summary
          </Heading>
          <Text className="text-sm text-[var(--muted-foreground)]">
            Reusable surface with hierarchy and actions.
          </Text>
        </Card>
      );
    case 'DatePicker':
      return <DatePicker selectedDate={date} onChange={setDate} />;
    case 'Tooltip':
      return (
        <Text className="text-sm text-[var(--muted-foreground)]">
          Hover behavior is best experienced directly in the live docs build.
        </Text>
      );
    case 'Modal':
      return (
        <>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal open={modalOpen} onOpenChange={setModalOpen}>
            <Modal.Content>
              <Modal.Header>
                <Modal.Title>Confirm release</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Text>Ship docs update to production?</Text>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close asChild>
                  <Button variant="secondary">Close</Button>
                </Modal.Close>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </>
      );
    case 'DataTable': {
      const rows = [
        { id: 1, package: 'core', focus: 'Primitives' },
        { id: 2, package: 'motion', focus: 'Animations' },
        { id: 3, package: 'themes', focus: 'Tokens' },
      ];
      const columns = [
        { key: 'id', header: 'ID' },
        { key: 'package', header: 'Package' },
        { key: 'focus', header: 'Focus' },
      ];
      return <DataTable data={rows} columns={columns} pageSize={3} />;
    }
    case 'Tabs':
      return (
        <div className="space-y-3">
          <Tabs defaultValue="overview">
            <div className="flex gap-2">
              <Button size="sm">Overview</Button>
              <Button size="sm" variant="secondary">
                Usage
              </Button>
            </div>
          </Tabs>
          <Alert variant="success">
            Tabs are ideal for progressive disclosure in docs.
          </Alert>
        </div>
      );
    case 'AuthLayout':
      return (
        <div className="grid gap-3 md:grid-cols-[1fr,0.8fr]">
          <div className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
            Form area
          </div>
          <div className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
            Aside panel
          </div>
        </div>
      );
    case 'DocsLayout':
      return (
        <div className="grid gap-3 md:grid-cols-[180px,1fr]">
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Sidebar rail
          </div>
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Content canvas
          </div>
        </div>
      );
    case 'DashboardLayout':
      return (
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Header
          </div>
          <div className="grid gap-3 md:grid-cols-[180px,1fr]">
            <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
              Sidebar
            </div>
            <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
              Dashboard content
            </div>
          </div>
        </div>
      );
    case 'MarketingLayout':
      return (
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Header
          </div>
          <div className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
            Hero and marketing sections
          </div>
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Footer
          </div>
        </div>
      );
    case 'SidebarLayout':
      return (
        <div className="grid gap-3 md:grid-cols-[220px,1fr]">
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Persistent sidebar
          </div>
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Main content area
          </div>
        </div>
      );
    case 'StackedLayout':
      return (
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Header block
          </div>
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Stacked section 1
          </div>
          <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]">
            Stacked section 2
          </div>
        </div>
      );
    default:
      return (
        <Text className="text-sm text-[var(--muted-foreground)]">
          Interactive preview coming soon.
        </Text>
      );
  }
}

function PropsTable({ component }: { component: ComponentDoc }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-[var(--accent)] text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Prop</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {component.props.map((prop) => (
            <tr key={prop.name} className="border-t border-[var(--border)]">
              <td className="px-4 py-3 font-medium">{prop.name}</td>
              <td className="px-4 py-3 text-[var(--muted-foreground)]">
                {prop.type}
              </td>
              <td className="px-4 py-3 text-[var(--muted-foreground)]">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--accent)] p-4 text-sm">
      <code>{code}</code>
    </pre>
  );
}

function ComponentSection({
  category,
  activeId,
  onActive,
}: {
  category: CategoryKey;
  activeId: string;
  onActive: (id: string) => void;
}) {
  const items = CATEGORY_META[category].inventory;
  const meta = CATEGORY_META[category];

  return (
    <section id={`section-${category}`} className="space-y-6">
      <div>
        <Heading as="h2" className="mb-2 text-3xl font-bold">
          {meta.title}
        </Heading>
        <Text className="text-[var(--muted-foreground)]">
          {meta.description}
        </Text>
        <Text className="mt-2 text-sm text-[var(--muted-foreground)]">
          Available: {items.join(', ')}
        </Text>
      </div>

      <div className="space-y-8">
        {items.map((itemName) => {
          const component = COMPONENTS.find((entry) => entry.name === itemName);

          if (!component) {
            return (
              <article
                key={itemName}
                id={itemName}
                className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="space-y-2">
                  <Breadcrumb
                    items={[
                      { label: 'Components', href: '#components' },
                      { label: meta.title, href: `#section-${category}` },
                      { label: itemName, href: `#${itemName}` },
                    ]}
                  />
                  <Heading as="h3" className="!mb-0 text-2xl font-semibold">
                    {itemName}
                  </Heading>
                  <Text className="text-[var(--muted-foreground)]">
                    API reference for this component is still being written, but
                    the component is part of the exported library inventory.
                  </Text>
                </div>
                <Alert>
                  Documentation details for {itemName} are queued in the next
                  pass.
                </Alert>
              </article>
            );
          }

          return (
            <article
              key={component.name}
              id={component.name}
              className={`space-y-5 rounded-3xl border p-6 transition-colors ${
                activeId === component.name
                  ? 'border-[var(--primary)] bg-[var(--card)]'
                  : 'border-[var(--border)] bg-[var(--card)]'
              }`}
              onMouseEnter={() => onActive(component.name)}
            >
              <div className="space-y-2">
                <Breadcrumb
                  items={[
                    { label: 'Components', href: '#components' },
                    { label: meta.title, href: `#section-${category}` },
                    { label: component.name, href: `#${component.name}` },
                  ]}
                />
                <Heading as="h3" className="!mb-0 text-2xl font-semibold">
                  {component.name}
                </Heading>
                <Text className="text-[var(--muted-foreground)]">
                  {component.description}
                </Text>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
                <div className="space-y-4">
                  <Heading as="h4" className="!mb-0 text-lg font-semibold">
                    Live example
                  </Heading>
                  <div className="rounded-2xl border border-[var(--border)] p-5">
                    <ExamplePreview component={component} />
                  </div>
                </div>
                <div className="space-y-4">
                  <Heading as="h4" className="!mb-0 text-lg font-semibold">
                    Copy snippet
                  </Heading>
                  <CodeBlock code={component.code} />
                </div>
              </div>

              <div className="space-y-4">
                <Heading as="h4" className="!mb-0 text-lg font-semibold">
                  Props
                </Heading>
                <PropsTable component={component} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section className="space-y-4">
      <div>
        <Heading as="h2" className="mb-2 text-3xl font-bold">
          Roadmap
        </Heading>
        <Text className="text-[var(--muted-foreground)]">
          Remaining work is now focused on deepening per-component API coverage
          rather than fixing structure.
        </Text>
      </div>
      <Card className="p-6">
        <Timeline
          items={[
            {
              id: '1',
              title: 'Inventory coverage',
              description:
                'Every exported component is now visible in navigation and category listings.',
            },
            {
              id: '2',
              title: 'Interactive docs',
              description:
                'Search, sidebar navigation and live examples cover the primary documentation flow.',
            },
            {
              id: '3',
              title: 'Reference depth',
              description:
                'Expand placeholder API sections into full examples and prop documentation.',
            },
          ]}
        />
      </Card>
    </section>
  );
}

function DocsShell() {
  const [activeId, setActiveId] = useState(
    CATEGORY_META.atoms.inventory[0] ?? 'Button'
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DocsHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px,1fr] lg:px-8">
        <DocsSidebar activeId={activeId} />

        <main className="space-y-8 pb-16">
          <HeroSection />
          <CategoryCards />
          <DocsSearch />
          <ComponentSection
            category="atoms"
            activeId={activeId}
            onActive={setActiveId}
          />
          <ComponentSection
            category="molecules"
            activeId={activeId}
            onActive={setActiveId}
          />
          <ComponentSection
            category="organisms"
            activeId={activeId}
            onActive={setActiveId}
          />
          <ComponentSection
            category="templates"
            activeId={activeId}
            onActive={setActiveId}
          />
          <RoadmapSection />
        </main>
      </div>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Text className="text-sm text-[var(--muted-foreground)]">
            © 2026 UI Construction Library
          </Text>
          <Text className="text-sm text-[var(--muted-foreground)]">
            Version {VERSION}
          </Text>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
}

function getSystemTheme(): 'light' | 'dark' {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

export function DocsApp() {
  return (
    <ThemeProvider defaultTheme={getSystemTheme()}>
      <DocsShell />
    </ThemeProvider>
  );
}

export default DocsApp;
