import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  CrossSiteNav,
  DataTable,
  DatePicker,
  Dropdown,
  fadeInProps,
  getSlideInProps,
  Heading,
  Icon,
  Input,
  Kanban,
  Link,
  Modal,
  MotionFadeIn,
  MotionSlideIn,
  Navigation,
  Progress,
  RadioButton,
  Select,
  Spinner,
  Text,
  TextArea,
  ThemeProvider,
  Toast,
  Tooltip,
  useAsync,
  useClickOutside,
  useDebounce,
  useIntersectionObserver,
  useMediaQuery,
  usePrevious,
  useTheme,
  useToggle,
} from '@ui-construction-library/core';
import { FormField } from '@ui-construction-library/react-hook-form';
import { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { flagshipFlows } from './flagshipFlows';

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

const integrationPackages = [
  '@ui-construction-library/react-hook-form',
  '@ui-construction-library/integration-tanstack-query',
  '@ui-construction-library/integration-tanstack-router',
  '@ui-construction-library/integration-i18n',
  '@ui-construction-library/integration-next',
] as const;

type Lead = {
  name: string;
  email: string;
  company: string;
};

type DemoPackage = {
  id: number;
  name: string;
  role: string;
  metric: string;
};

const packages: DemoPackage[] = [
  {
    id: 1,
    name: 'core',
    role: 'Primitives and patterns',
    metric: 'atoms → templates',
  },
  {
    id: 2,
    name: 'tokens',
    role: 'Color, spacing and type system',
    metric: 'custom brand palette',
  },
  {
    id: 3,
    name: 'icons',
    role: 'Asset layer',
    metric: 'Lucide + local package',
  },
  {
    id: 4,
    name: 'react-hook-form',
    role: 'Forms integration',
    metric: 'real wired demo',
  },
  {
    id: 5,
    name: 'theme',
    role: 'Runtime appearance switching',
    metric: 'persisted light/dark',
  },
];

const kanbanColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      {
        id: 'audit-hero',
        title: 'Sharpen hero value prop',
        description: 'Make the public pitch clearer.',
      },
      {
        id: 'audit-theme',
        title: 'Show ThemeProvider in action',
        description: 'Expose runtime theming in the demo.',
      },
    ],
  },
  {
    id: 'active',
    title: 'Active',
    cards: [
      {
        id: 'audit-motion',
        title: 'Demonstrate motion presets',
        description: 'Connect fade and slide utilities to product states.',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: 'audit-install',
        title: 'Add install snippet',
        description: 'Keep setup visible in hero.',
      },
      {
        id: 'audit-docs',
        title: 'Surface docs and Storybook',
        description: 'Link public references from the demo.',
      },
    ],
  },
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="stack stack-tight section-intro">
      <Text className="eyebrow">{eyebrow}</Text>
      <Heading as="h2" className="section-heading">
        {title}
      </Heading>
      <Text className="section-description">{description}</Text>
    </div>
  );
}

function HeaderBar() {
  const { theme, setTheme } = useTheme();

  return (
    <Navigation className="site-nav">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Icon name="star" size={18} />
        </div>
        <div className="stack stack-tight">
          <Heading as="h1" className="brand-title">
            UI Construction Library
          </Heading>
          <Text className="brand-subtitle">Composable React UI system</Text>
        </div>
        <Badge>v0.1</Badge>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('components')}
        >
          Components
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('integrations')}
        >
          Integrations
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('hooks')}
        >
          Hooks
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('flagship-flows')}
        >
          Flagship flows
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </div>
    </Navigation>
  );
}

function FlagshipFlowsSection() {
  const [selectedFlowId, setSelectedFlowId] = useState(flagshipFlows[0].id);
  const selectedFlow =
    flagshipFlows.find((flow) => flow.id === selectedFlowId) ??
    flagshipFlows[0];

  return (
    <section id="flagship-flows" className="flagship-shell">
      <div className="stack stack-tight flagship-intro">
        <Text className="eyebrow">Flagship flows</Text>
        <Heading as="h2" className="section-heading flagship-heading">
          Five proof flows that show the product end to end
        </Heading>
        <Text className="section-description flagship-description">
          Each flow is represented as prompt input, builder state, exported
          artifact, and runnable demo. The set is meant to prove that the system
          is more than isolated components: it can carry a product idea from
          generation through publishing with predictable output.
        </Text>
      </div>

      <div className="flagship-layout">
        <div className="flagship-rail">
          {flagshipFlows.map((flow, index) => {
            const active = flow.id === selectedFlow.id;
            return (
              <button
                key={flow.id}
                type="button"
                className={active ? 'flagship-chip active' : 'flagship-chip'}
                onClick={() => setSelectedFlowId(flow.id)}
                aria-pressed={active}
              >
                <span className="flagship-chip-index">0{index + 1}</span>
                <span className="flagship-chip-copy">
                  <strong>{flow.name}</strong>
                  <small>{flow.audience}</small>
                </span>
              </button>
            );
          })}
        </div>

        <Card className="flagship-detail">
          <div className="flagship-detail__header">
            <div className="stack stack-tight">
              <Text className="eyebrow">Selected flow</Text>
              <Heading as="h3" className="card-title">
                {selectedFlow.name}
              </Heading>
            </div>
            <Badge variant="default">{selectedFlow.audience}</Badge>
          </div>

          <div className="flagship-grid">
            <div className="flagship-panel">
              <Text className="eyebrow">Prompt input</Text>
              <Text className="flagship-copy">{selectedFlow.promptInput}</Text>
            </div>
            <div className="flagship-panel">
              <Text className="eyebrow">Builder state</Text>
              <Text className="flagship-copy">{selectedFlow.builderState}</Text>
            </div>
            <div className="flagship-panel">
              <Text className="eyebrow">Exported artifact</Text>
              <Text className="flagship-copy">
                {selectedFlow.exportedArtifact}
              </Text>
            </div>
            <div className="flagship-panel">
              <Text className="eyebrow">Runnable demo</Text>
              <Text className="flagship-copy">{selectedFlow.runnableDemo}</Text>
            </div>
          </div>

          <div className="flagship-proof">
            {selectedFlow.proofPoints.map((proof) => (
              <Badge key={proof}>{proof}</Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="flagship-summary-grid">
        {flagshipFlows.map((flow) => (
          <Card key={flow.id} className="flagship-summary">
            <Text className="eyebrow">{flow.name}</Text>
            <Text className="text-muted">{flow.audience}</Text>
            <div className="flagship-summary__line" />
            <Text className="flagship-copy">{flow.promptInput}</Text>
          </Card>
        ))}
      </div>
    </section>
  );
}

function HeroSection() {
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
              <Icon name="check" size={16} />
              <Text>{item}</Text>
            </div>
          ))}
        </div>
        <div className="hero-cta wrap-row">
          <Button as="a" href={DOCS_URL} size="lg">
            Open docs
          </Button>
          <Button as="a" href={STORYBOOK_URL} variant="outline" size="lg">
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

function ArchitectureSection() {
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

function LeadFormCard() {
  const { control, handleSubmit } = useForm<Lead>({
    defaultValues: { name: '', email: '', company: '' },
  });
  const [message, setMessage] = useState('Waiting for submit…');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="panel">
      <SectionIntro
        eyebrow="Integration"
        title="React Hook Form integration wired to real inputs"
        description="This card proves that the library is not just visual. The fields are connected through the dedicated integration package and show the intended form authoring experience."
      />
      <form
        onSubmit={handleSubmit((data) => {
          setMessage(`✅ Lead captured: ${data.name} (${data.company})`);
          setSubmitted(true);
        })}
      >
        <div className="stack">
          <FormField control={control as any} name="name" label="Full Name" />
          <FormField control={control as any} name="email" label="Work Email" />
          <FormField control={control as any} name="company" label="Company" />
          <Button type="submit">Create Lead</Button>
          {submitted ? (
            <Alert variant="success" title="Lead created">
              {message}
            </Alert>
          ) : (
            <Text className="text-muted">{message}</Text>
          )}
        </div>
      </form>
    </Card>
  );
}

function ThemePlaygroundCard() {
  const { theme, setTheme } = useTheme();
  const [modeLabel, setModeLabel] = useState('Brand default');

  return (
    <Card className="panel">
      <SectionIntro
        eyebrow="Theme system"
        title="ThemeProvider drives runtime product theming"
        description="This section demonstrates that theming is a real app concern. The provider updates runtime state, switches semantic surfaces and keeps docs or product shells aligned without page reloads."
      />
      <div className="stack">
        <div className="row wrap-row">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => {
              setTheme('light');
              setModeLabel('Light product surface applied');
            }}
          >
            Light workspace
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => {
              setTheme('dark');
              setModeLabel('Dark product surface applied');
            }}
          >
            Dark workspace
          </Button>
        </div>
        <Alert variant="default" title="Theme state">
          {modeLabel}. Current runtime theme: {theme}.
        </Alert>
        <div className="theme-token-preview">
          <div className="theme-swatch theme-swatch--primary" />
          <div className="theme-swatch theme-swatch--accent" />
          <div className="theme-swatch theme-swatch--card" />
          <div className="theme-swatch theme-swatch--border" />
        </div>
        <div className="feature-grid feature-grid--dual">
          <Card className="compact-panel">
            <Text className="eyebrow">Runtime state</Text>
            <Text className="text-muted">
              ThemeProvider updates `data-theme`, persists the current mode and
              keeps the whole surface in sync without routing or reloads.
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Semantic surfaces</Text>
            <Text className="text-muted">
              These swatches represent the same token vocabulary used by panels,
              borders, emphasis and content layers across the library.
            </Text>
          </Card>
        </div>
      </div>
    </Card>
  );
}

function ComponentGalleryCard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dropdownValue, setDropdownValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'primary' | 'outline' | 'ghost'
  >('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const tableColumns = useMemo(
    () => [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'name', header: 'Package', sortable: true },
      { key: 'role', header: 'Focus' },
      {
        key: 'metric',
        header: 'Signal',
        render: (row: DemoPackage) => row.metric,
      },
    ],
    []
  );
  const filteredPackages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const bySearch = query
      ? packages.filter((item) =>
          `${item.name} ${item.role} ${item.metric}`
            .toLowerCase()
            .includes(query)
        )
      : packages;

    if (activeFilter === 'all') return bySearch;
    if (activeFilter === 'primary') {
      return bySearch.filter(
        (item) => item.name === 'core' || item.name === 'tokens'
      );
    }
    if (activeFilter === 'outline') {
      return bySearch.filter(
        (item) =>
          item.name.includes('react-hook-form') || item.name.includes('theme')
      );
    }
    return bySearch.filter((item) => item.name.includes('icons'));
  }, [searchQuery, activeFilter]);

  return (
    <Card className="panel" id="components">
      <SectionIntro
        eyebrow="Components"
        title="Atoms, molecules and product patterns in one surface"
        description="The demo intentionally mixes basic controls, feedback states, overlays and data presentation so consumers can evaluate the library as a system instead of isolated snapshots."
      />

      <div className="stack">
        <div className="row wrap-row">
          <Button onClick={() => setActiveFilter('primary')}>Primary</Button>
          <Button variant="outline" onClick={() => setActiveFilter('outline')}>
            Outline
          </Button>
          <Button variant="ghost" onClick={() => setActiveFilter('ghost')}>
            Ghost
          </Button>
          <Badge>Badge</Badge>
          <Progress value={68} />
        </div>

        <div className="showcase-grid">
          <Input
            label="Search packages"
            placeholder="Search components…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Select
            label="Category"
            options={[
              { label: 'Atoms', value: 'atoms' },
              { label: 'Molecules', value: 'molecules' },
              { label: 'Organisms', value: 'organisms' },
            ]}
          />
          <div className="stack-tight">
            <Dropdown
              label="Framework"
              items={[
                { id: 'react', label: 'React', value: 'react' },
                { id: 'next', label: 'Next.js', value: 'next' },
                { id: 'vite', label: 'Vite', value: 'vite' },
              ]}
              placeholder="Select..."
              onChange={setDropdownValue}
            />
            <Text className="text-muted">Selected: {dropdownValue || '—'}</Text>
          </div>
          <DatePicker
            label="Target date"
            selectedDate={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>

        <div className="showcase-grid">
          <Checkbox label="Include integrations" />
          <RadioButton label="Stable release" name="release" value="stable" />
          <RadioButton label="Canary release" name="release" value="canary" />
          <Tooltip content="Tooltips, modals and toasts are part of the same package surface.">
            <Button variant="outline">Hover for tooltip</Button>
          </Tooltip>
        </div>

        <div className="stack-tight">
          <Text className="eyebrow">Notes</Text>
          <TextArea
            label="Notes"
            placeholder="Describe your adoption scenario…"
            rows={4}
          />
        </div>

        <div className="row wrap-row">
          <Button onClick={() => setModalOpen(true)}>
            Open quickstart modal
          </Button>
          <Button variant="outline" onClick={() => setToastVisible(true)}>
            Trigger toast
          </Button>
        </div>

        <Text className="text-muted">
          Active filter: {activeFilter}. Results: {filteredPackages.length}
        </Text>
        <DataTable columns={tableColumns} data={filteredPackages} />

        <Card className="compact-panel stack-tight">
          <Text className="eyebrow">Drag and drop</Text>
          <Heading as="h3" className="card-title">
            Kanban workflow powered by the core organism layer
          </Heading>
          <Text className="text-muted">
            The library already includes a Kanban organism built on the owned
            drag-and-drop layer. This public demo now exposes it directly so
            teams can evaluate drag-and-drop workflow patterns instead of only
            reading that DnD support exists.
          </Text>
          <Kanban
            columns={kanbanColumns.map((column) => ({
              ...column,
              cards: [...column.cards],
            }))}
          />
        </Card>
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <Modal.Content title="Component stack">
          <Modal.Body>
            <Text>
              Modals, tables, forms and themed actions all share the same design
              language and token layer.
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="outline">Close</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {toastVisible
        ? createPortal(
            <Toast onAnimationEnd={() => setToastVisible(false)}>
              Toast feedback from the same UI kit.
            </Toast>,
            document.body
          )
        : null}
    </Card>
  );
}

type AsyncDemoStatus = 'idle' | 'loading' | 'success' | 'error';

const ASYNC_STATUS_LABEL: Record<AsyncDemoStatus, string> = {
  idle: 'Idle',
  loading: 'Loading',
  success: 'Success',
  error: 'Error',
};

function MotionAndHooksCard() {
  const runAsyncDemo = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return 'Async hook resolved a demo payload.';
  }, []);
  const { run, loading } = useAsync(runAsyncDemo);
  const [asyncStatus, setAsyncStatus] = useState<AsyncDemoStatus>('idle');
  const [asyncMessage, setAsyncMessage] = useState(
    'Click "Run async" to fetch demo data.'
  );
  const [search, setSearch] = useState('tokens');
  const debouncedSearch = useDebounce(search, 300);
  const previousSearch = usePrevious(search);
  const isDesktop = useMediaQuery('(min-width: 960px)');
  const [toggled, toggle] = useToggle(true);
  const [motionReplay, setMotionReplay] = useState(0);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const { isIntersecting, targetRef } = useIntersectionObserver();

  const handleRunAsync = async () => {
    setAsyncStatus('loading');
    setAsyncMessage('Fetching demo payload…');

    try {
      const result = await run();
      setAsyncMessage(result);
      setAsyncStatus('success');
    } catch (err) {
      setAsyncMessage(
        err instanceof Error ? err.message : 'Async hook failed. Try again.'
      );
      setAsyncStatus('error');
    }
  };

  useClickOutside(floatingRef, () => {
    if (!toggled) return;
    toggle();
  });

  return (
    <Card className="panel" id="hooks">
      <SectionIntro
        eyebrow="Hooks and motion"
        title="Utilities and transitions are part of the core layer"
        description="The project already ships useful hooks and motion primitives. This section turns them into visible product proof instead of keeping them hidden in source code."
      />

      <div className="stack">
        <div className="feature-grid feature-grid--three">
          <Card className="compact-panel stack-tight">
            <Text className="eyebrow">useAsync</Text>
            <div
              className="row wrap-row"
              style={{ alignItems: 'center', gap: 10 }}
              role="status"
              aria-live="polite"
            >
              <Badge
                variant={
                  asyncStatus === 'success'
                    ? 'success'
                    : asyncStatus === 'error'
                      ? 'error'
                      : asyncStatus === 'loading'
                        ? 'warning'
                        : 'default'
                }
              >
                {ASYNC_STATUS_LABEL[asyncStatus]}
              </Badge>
              {loading ? <Spinner size={20} /> : null}
            </div>
            <Text>{asyncMessage}</Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleRunAsync()}
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Running…' : 'Run async'}
            </Button>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">useDebounce</Text>
            <Input
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Text className="text-muted">Live: {search}</Text>
            <Text className="text-muted">Debounced: {debouncedSearch}</Text>
            <Text className="text-muted">
              Previous: {previousSearch ?? '—'}
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Responsive signal</Text>
            <Text>
              {isDesktop ? 'Desktop layout active' : 'Compact layout active'}
            </Text>
          </Card>
        </div>

        <div className="row wrap-row">
          <Button
            variant="outline"
            onClick={() => setMotionReplay((value) => value + 1)}
          >
            Replay motion
          </Button>
        </div>

        <div className="feature-grid feature-grid--dual">
          <MotionFadeIn key={`fade-${motionReplay}`} {...fadeInProps}>
            <div className="motion-band stack-tight">
              <Text className="eyebrow">MotionFadeIn</Text>
              <Text>
                Fade primitives help present success states, callouts and
                section reveals without custom wiring in every screen.
              </Text>
              <Text className="text-muted">
                Useful for inline confirmations, staged reveals and product
                moments that need soft emphasis instead of abrupt appearance.
              </Text>
            </div>
          </MotionFadeIn>

          <MotionSlideIn
            key={`slide-${motionReplay}`}
            {...getSlideInProps('right')}
          >
            <div className="motion-band stack-tight">
              <Text className="eyebrow">MotionSlideIn</Text>
              <Text>
                Slide transitions can frame onboarding, drawers and inline
                workflow hints as part of the same UI system.
              </Text>
              <Text className="text-muted">
                The same primitive can support panels, guided setup flows and
                contextual handoffs between product states.
              </Text>
            </div>
          </MotionSlideIn>
        </div>

        <div className="feature-grid feature-grid--three">
          <Card className="compact-panel">
            <Text className="eyebrow">Fade preset</Text>
            <Text className="text-muted">
              Reusable animation props reduce duplicate Framer Motion wiring in
              app screens and docs surfaces.
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Slide preset</Text>
            <Text className="text-muted">
              Directional transitions give drawers, prompts and helper panels a
              consistent movement language.
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Core utility</Text>
            <Text className="text-muted">
              Motion ships as part of the component system, so teams can treat
              it like another typed primitive instead of ad-hoc animation glue.
            </Text>
          </Card>
        </div>

        <Alert variant="success" title="Motion primitives">
          Motion props are available as reusable building blocks rather than
          one-off showcase animations. This demo now shows how fade and slide
          presets map to real product states.
        </Alert>

        <div className="showcase-grid">
          <div
            className="observer-band stack-tight"
            ref={targetRef as React.RefObject<HTMLDivElement>}
          >
            <Text className="eyebrow">Intersection observer</Text>
            <Text>
              {isIntersecting
                ? 'The observed block is visible.'
                : 'Scroll this block into view.'}
            </Text>
          </div>

          {toggled ? (
            <div className="floating-inspector stack-tight" ref={floatingRef}>
              <Text className="eyebrow">useClickOutside + useToggle</Text>
              <Text>
                Click anywhere outside this card to dismiss it. This pattern is
                useful for menus, inspectors and quick action trays.
              </Text>
            </div>
          ) : (
            <Button variant="outline" onClick={() => toggle()}>
              Re-open floating inspector
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function IntegrationsSection() {
  return (
    <section id="integrations" className="stack">
      <SectionIntro
        eyebrow="Integrations"
        title="Framework adapters make the library more than a component bundle"
        description="Separate integration packages are a differentiator. They deserve a visible place in the public demo because they communicate maturity and practical adoption paths."
      />
      <div className="feature-grid feature-grid--three">
        {integrationPackages.map((pkg) => (
          <Card key={pkg} className="panel compact-panel">
            <Text className="eyebrow">Package</Text>
            <Heading as="h3" className="card-title">
              {pkg}
            </Heading>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="footer-panel">
      <div className="stack stack-tight">
        <Text className="eyebrow">Public entry points</Text>
        <Heading as="h2" className="section-heading">
          Explore the full library surface
        </Heading>
      </div>
      <div className="row wrap-row">
        <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          View GitHub
        </Link>
        <Link href={DOCS_URL}>Open docs</Link>
        <Link href={STORYBOOK_URL}>Open Storybook</Link>
      </div>
    </footer>
  );
}

function ShowcasePage() {
  return (
    <div className="showcase-page">
      <HeaderBar />
      <main className="showcase-shell stack-xl">
        <HeroSection />
        <FlagshipFlowsSection />
        <CrossSiteNav
          current="demo"
          docsHref={DOCS_URL}
          storybookHref={STORYBOOK_URL}
        />
        <ArchitectureSection />
        <div className="feature-grid feature-grid--dual">
          <ThemePlaygroundCard />
          <LeadFormCard />
        </div>
        <ComponentGalleryCard />
        <IntegrationsSection />
        <MotionAndHooksCard />
        <FooterSection />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ShowcasePage />
    </ThemeProvider>
  );
}
