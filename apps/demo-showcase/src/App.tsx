import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  DatePicker,
  Dropdown,
  fadeInProps,
  getSlideInProps,
  Heading,
  Icon,
  Input,
  Link,
  Modal,
  MotionFadeIn,
  MotionSlideIn,
  Navigation,
  Progress,
  RadioButton,
  Select,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const GITHUB_URL = 'https://github.com/jilimb0/UI-Library';
const DOCS_URL = 'https://stunning-froyo-3c3fbb.netlify.app';

type Lead = {
  name: string;
  email: string;
  company: string;
};

type DemoPackage = {
  id: number;
  name: string;
  role: string;
  mrr: number;
};

const packages: DemoPackage[] = [
  { id: 1, name: 'core', role: 'Primitives', mrr: 12400 },
  { id: 2, name: 'react-hook-form', role: 'Forms', mrr: 8900 },
  { id: 3, name: 'motion', role: 'Animation', mrr: 10900 },
  { id: 4, name: 'themes', role: 'Tokens', mrr: 7600 },
  { id: 5, name: 'icons', role: 'Assets', mrr: 14300 },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="stack stack-tight">
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
    <Navigation className="row row-between">
      <div className="row">
        <Icon name="star" size={22} />
        <Heading as="h1" className="hero-title">
          UI Library Showcase
        </Heading>
        <Badge>Production Demo</Badge>
      </div>
      <div className="row">
        <button
          type="button"
          className="nav-link active"
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
          onClick={() => scrollTo('hooks')}
        >
          Hooks
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

function LeadFormCard() {
  const { control, handleSubmit } = useForm<Lead>({
    defaultValues: { name: '', email: '', company: '' },
  });
  const [message, setMessage] = useState('Waiting for submit…');

  return (
    <Card className="panel">
      <SectionIntro
        title="React Hook Form Integration"
        description="Real form wiring with @ui-construction-library/react-hook-form."
      />
      <form
        onSubmit={handleSubmit((data) => {
          setMessage(`✅ Lead captured: ${data.name} (${data.company})`);
        })}
      >
        <div className="stack">
          <FormField control={control} name="name" label="Full Name" />
          <FormField control={control} name="email" label="Work Email" />
          <FormField control={control} name="company" label="Company" />
          <Button type="submit">Create Lead</Button>
          <Text className="text-muted">{message}</Text>
        </div>
      </form>
    </Card>
  );
}

function ComponentGalleryCard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dropdownValue, setDropdownValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const timeout = window.setTimeout(() => setToastVisible(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [toastVisible]);

  const tableColumns = useMemo(
    () => [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'name', header: 'Package', sortable: true },
      { key: 'role', header: 'Focus' },
      {
        key: 'mrr',
        header: 'Weekly installs',
        sortable: true,
        render: (row: DemoPackage) => `${row.mrr.toLocaleString()}`,
      },
    ],
    []
  );

  return (
    <Card className="panel" id="components">
      <SectionIntro
        title="Component Gallery"
        description="Atoms, molecules and organisms presented as a production-ready UI toolkit."
      />

      <div className="stack">
        <div className="row">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Tooltip content="Search in-app entities">
            <Button variant="outline" aria-label="Search">
              <Icon name="search" size={16} />
            </Button>
          </Tooltip>
        </div>

        <div className="row">
          <Checkbox label="Marketing Opt-in" description="Send product news" />
          <RadioButton name="plan" value="starter" label="Starter" />
          <RadioButton name="plan" value="pro" label="Pro" />
        </div>

        <div className="row row-top">
          <div className="field-col">
            <Input label="Project Name" placeholder="Aurora Dashboard" />
          </div>
          <div className="field-col">
            <Select
              label="Region"
              options={[
                { label: 'US East', value: 'us-east' },
                { label: 'Europe', value: 'eu' },
                { label: 'Asia Pacific', value: 'apac' },
              ]}
            />
          </div>
        </div>

        <TextArea placeholder="Describe your rollout strategy…" />

        <div className="row row-top">
          <Dropdown
            items={[
              { id: 1, label: 'Design System', value: 'design' },
              { id: 2, label: 'Commerce Kit', value: 'commerce' },
              { id: 3, label: 'Admin Portal', value: 'admin' },
            ]}
            onChange={setDropdownValue}
          />
          <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
        </div>

        <Alert variant="success">
          Live selection: {dropdownValue || 'none'} | date:{' '}
          {selectedDate?.toDateString()}
        </Alert>

        <Text className="text-muted">
          Table data below highlights package areas inside the library rather
          than mock CRM users.
        </Text>
        <DataTable data={packages} columns={tableColumns} pageSize={3} />

        <div className="row">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="secondary" onClick={() => setToastVisible(true)}>
            Trigger Toast
          </Button>
        </div>

        {toastVisible && <Toast>✅ Action completed successfully</Toast>}

        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Pricing Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Text>
                Everything in this modal is fully keyboard accessible.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close asChild>
                <Button variant="secondary">Close</Button>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </div>
    </Card>
  );
}

function HooksPlaygroundCard() {
  const viewport = useMediaQuery('(min-width: 768px)') ? 'Desktop' : 'Mobile';
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const previousQuery = usePrevious(debouncedQuery);
  const [enabled, toggleEnabled] = useToggle(true);
  const [asyncResult, setAsyncResult] = useState('Idle');
  const boxRef = useRef<HTMLDivElement>(null);

  const { isIntersecting: isInView, targetRef: intersectionRef } =
    useIntersectionObserver({ threshold: 0.5 });

  useClickOutside(boxRef as React.RefObject<HTMLElement>, () => {
    return;
  });

  const { loading, run } = useAsync(async () => {
    await new Promise((r) => setTimeout(r, 800));
    return 'Done ✔';
  });

  return (
    <Card className="panel" id="hooks">
      <SectionIntro
        title="Hooks Playground"
        description="State, async, media query, observer and click-outside behavior in a single panel."
      />

      <div className="stack">
        <div className="row">
          <div className="kpi kpi-grow">
            <div>
              <Text className="kpi-label">Viewport</Text>
              <Text className="kpi-value">{viewport}</Text>
            </div>
            <div>
              <Text className="kpi-label">Observer</Text>
              <Text
                className={
                  isInView ? 'kpi-value text-ok' : 'kpi-value text-muted'
                }
              >
                {isInView ? 'In view' : 'Out of view'}
              </Text>
            </div>
            <div>
              <Text className="kpi-label">Clicks outside</Text>
              <Text className="kpi-value">tracked</Text>
            </div>
          </div>
        </div>

        <Input
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          description={`Debounced: ${debouncedQuery || 'empty'} | Previous: ${previousQuery || 'empty'}`}
        />

        <div className="row">
          <Button
            onClick={toggleEnabled}
            variant={enabled ? 'default' : 'outline'}
          >
            Feature Toggle: {enabled ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="secondary"
            disabled={loading}
            onClick={async () => {
              const result = await run();
              setAsyncResult(result as string);
            }}
          >
            {loading ? 'Syncing…' : 'Run Async Action'}
          </Button>
          <Text className="text-muted">{asyncResult}</Text>
        </div>

        <div ref={boxRef} className="dashed-box">
          Click outside this box to trigger <code>useClickOutside</code>.
        </div>

        <div
          ref={intersectionRef as React.RefObject<HTMLDivElement>}
          className="scroll-box"
        >
          Scroll this card to toggle <code>useIntersectionObserver</code>.
        </div>
      </div>
    </Card>
  );
}

function MotionCard() {
  const [tab, setTab] = useState<'overview' | 'stats' | 'roadmap'>('overview');

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'stats', label: 'Stats' },
    { value: 'roadmap', label: 'Roadmap' },
  ] as const;

  return (
    <Card className="panel">
      <SectionIntro
        title="Motion + Tabs + Progressive Loading"
        description="Animations, tab state and UX micro-structure."
      />

      <div className="row tabs-row">
        {tabs.map((t) => (
          <Button
            key={t.value}
            variant={tab === t.value ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <MotionFadeIn {...fadeInProps}>
        {tab === 'overview' && (
          <Text>
            Launch-ready design system powered by reusable primitives and strict
            accessibility checks.
          </Text>
        )}
        {tab === 'stats' && (
          <MotionSlideIn {...getSlideInProps('left')}>
            <div className="stack">
              <div className="stack stack-tight">
                <Text className="metric-label">TypeScript coverage</Text>
                <Progress value={100} />
              </div>
              <div className="stack stack-tight">
                <Text className="metric-label">Test coverage</Text>
                <Progress value={96} />
              </div>
              <div className="stack stack-tight">
                <Text className="metric-label">Accessibility score</Text>
                <Progress value={91} />
              </div>
            </div>
          </MotionSlideIn>
        )}
        {tab === 'roadmap' && (
          <div className="stack">
            <Text className="kpi-value">Upcoming</Text>
            <Text className="text-muted">
              🟡 v0.2 — Charts integration, advanced DataTable filters
            </Text>
            <Text className="text-muted">
              🔵 v0.3 — Drag & Drop, Kanban polish, Timeline
            </Text>
            <Text className="text-muted">
              🟢 v1.0 — Stable API, full docs, visual regression tests
            </Text>
          </div>
        )}
      </MotionFadeIn>

      <Text className="footer-note">
        This demo intentionally combines multiple packages in one
        marketing-grade page.
      </Text>
    </Card>
  );
}

export function App() {
  const systemTheme =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  return (
    <ThemeProvider defaultTheme={systemTheme}>
      <div className="showcase-root">
        <main className="showcase">
          <section className="hero" id="overview">
            <HeaderBar />
            <Text className="hero-copy">
              One-page product demo for sales calls, docs front page, or launch
              campaigns. Includes atoms, molecules, organisms, hooks, themes,
              animations, and form integrations.
            </Text>
          </section>

          <section className="grid">
            <LeadFormCard />
            <ComponentGalleryCard />
            <HooksPlaygroundCard />
            <MotionCard />
          </section>

          <section className="panel cta-panel">
            <SectionIntro
              title="Call to Action"
              description="Ready for production pipelines, semantic versioning and visual testing."
            />
            <div className="row">
              <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Icon name="star" size={16} />
                  &nbsp;Start Building
                </Button>
              </a>
              <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </Link>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}
