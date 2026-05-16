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
  MenuItem,
  Modal,
  MotionFadeIn,
  MotionSlideIn,
  Navigation,
  Progress,
  RadioButton,
  Select,
  Skeleton,
  Spinner,
  Tabs,
  Text,
  TextArea,
  ThemeProvider,
  Toast,
  Tooltip,
  useAsync,
  useClickOutside,
  useDebounce,
  useIntersectionObserver,
  useLocalStorage,
  useMediaQuery,
  usePrevious,
  useTheme,
  useToggle,
} from '@ui-construction-library/core';
import { FormField } from '@ui-construction-library/react-hook-form';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type Lead = {
  name: string;
  email: string;
  company: string;
};

type DemoUser = {
  id: number;
  name: string;
  role: string;
  mrr: number;
};

const users: DemoUser[] = [
  { id: 1, name: 'Ari Kim', role: 'Founder', mrr: 12400 },
  { id: 2, name: 'Mia Flores', role: 'Marketing', mrr: 8900 },
  { id: 3, name: 'Noah Lane', role: 'Sales', mrr: 10900 },
  { id: 4, name: 'Emma Stone', role: 'Support', mrr: 7600 },
  { id: 5, name: 'Leo Ford', role: 'Engineer', mrr: 14300 },
];

const tabButtonClass = {
  marginRight: 8,
};

const TabButton = ({ selected, onSelect, children }: any) => (
  <Button
    variant={selected ? 'default' : 'secondary'}
    onClick={onSelect}
    style={tabButtonClass}
  >
    {children}
  </Button>
);

function HeaderBar() {
  const { theme, setTheme } = useTheme();

  return (
    <Navigation className="row" style={{ justifyContent: 'space-between' }}>
      <div className="row">
        <Icon name="star" size={22} />
        <Heading>UI Library Showcase</Heading>
        <Badge>Production Demo</Badge>
      </div>
      <div className="row">
        <MenuItem active>Overview</MenuItem>
        <MenuItem>Components</MenuItem>
        <MenuItem>Hooks</MenuItem>
        <Button
          variant="outline"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Theme: {theme}
        </Button>
      </div>
    </Navigation>
  );
}

function LeadFormCard() {
  const { control, handleSubmit } = useForm<Lead>({
    defaultValues: {
      name: '',
      email: '',
      company: '',
    },
  });

  const [message, setMessage] = useState('Waiting for submit...');

  return (
    <Card className="panel">
      <h2>React Hook Form Integration</h2>
      <p>Real form wiring with `@ui-construction-library/react-hook-form`.</p>
      <form
        onSubmit={handleSubmit((data) => {
          setMessage(`Lead captured: ${data.name} (${data.company})`);
        })}
      >
        <div className="stack">
          <FormField control={control} name="name" label="Full Name" />
          <FormField control={control} name="email" label="Work Email" />
          <FormField control={control} name="company" label="Company" />
          <Button type="submit">Create Lead</Button>
          <Text className="muted">{message}</Text>
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

  const tableColumns = useMemo(
    () => [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role' },
      {
        key: 'mrr',
        header: 'MRR',
        sortable: true,
        render: (row: DemoUser) => `$${row.mrr.toLocaleString()}`,
      },
    ],
    []
  );

  return (
    <Card className="panel">
      <h2>Component Gallery</h2>
      <p>Atoms, molecules, organisms and interactions.</p>

      <div className="stack">
        <div className="row">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Tooltip content="Search in-app entities">
            <Button variant="outline">
              <Icon name="search" size={16} />
            </Button>
          </Tooltip>
        </div>

        <div className="row">
          <Checkbox label="Marketing Opt-in" description="Send product news" />
          <RadioButton name="plan" value="starter" label="Starter" />
          <RadioButton name="plan" value="pro" label="Pro" />
        </div>

        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ minWidth: 260, flex: 1 }}>
            <Input label="Project Name" placeholder="Aurora Dashboard" />
          </div>
          <div style={{ minWidth: 260, flex: 1 }}>
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

        <TextArea placeholder="Describe your rollout strategy..." />

        <div className="row" style={{ alignItems: 'flex-start' }}>
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

        <DataTable data={users} columns={tableColumns} pageSize={3} />

        <div className="row">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setToastVisible(true);
            }}
          >
            Trigger Toast
          </Button>
          <Spinner />
        </div>

        {toastVisible && (
          <Toast onAnimationEnd={() => setToastVisible(false)}>
            Saved successfully. This toast auto-dismisses.
          </Toast>
        )}

        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <Heading>Pricing Confirmation</Heading>
          <Text>Everything in this modal is fully keyboard accessible.</Text>
        </Modal>
      </div>
    </Card>
  );
}

function HooksPlaygroundCard() {
  const [persistedName, setPersistedName] = useLocalStorage(
    'ui-lib-demo-name',
    'Product Team'
  );
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [enabled, toggleEnabled] = useToggle(true);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const previousQuery = usePrevious(query);
  const boxRef = useRef<HTMLDivElement>(null);
  const [outsideClicks, setOutsideClicks] = useState(0);
  useClickOutside(boxRef, () => setOutsideClicks((v) => v + 1));

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.4,
  });

  const { run, loading } = useAsync(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return 'Remote sync complete';
  });
  const [asyncResult, setAsyncResult] = useState('Idle');

  return (
    <Card className="panel">
      <h2>Hooks Playground</h2>
      <p>State, async, media query, observer and persisted storage.</p>

      <div className="kpi">
        <div>
          <div className="muted">Viewport</div>
          <div>{isDesktop ? 'Desktop' : 'Mobile/Tablet'}</div>
        </div>
        <div>
          <div className="muted">Observer</div>
          <div className={isIntersecting ? 'status' : ''}>
            {isIntersecting ? 'In view' : 'Out of view'}
          </div>
        </div>
        <div>
          <div className="muted">Outside Clicks</div>
          <div>{outsideClicks}</div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 12 }}>
        <Input
          label="Persisted Team Name"
          value={persistedName}
          onChange={(e) => setPersistedName(e.target.value)}
        />

        <Input
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          description={`Debounced: ${debouncedQuery || 'empty'} | Previous: ${
            previousQuery || 'empty'
          }`}
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
              setAsyncResult(result);
            }}
          >
            {loading ? 'Syncing...' : 'Run Async Action'}
          </Button>
          <Text className="muted">{asyncResult}</Text>
        </div>

        <div
          ref={boxRef}
          style={{
            border: '1px dashed #334155',
            borderRadius: 12,
            padding: 10,
          }}
        >
          Click outside this box to trigger `useClickOutside`.
        </div>

        <div
          ref={targetRef as React.RefObject<HTMLDivElement>}
          style={{
            border: '1px solid #334155',
            borderRadius: 12,
            padding: 12,
            minHeight: 70,
          }}
        >
          Scroll this card to toggle `useIntersectionObserver`.
        </div>
      </div>
    </Card>
  );
}

function MotionCard() {
  const [tab, setTab] = useState('overview');

  return (
    <Card className="panel">
      <h2>Motion + Tabs + Progressive Loading</h2>
      <p>Animations, tab state and UX micro-structure.</p>

      <Tabs defaultValue={tab} onValueChange={setTab}>
        <TabButton value="overview">Overview</TabButton>
        <TabButton value="stats">Stats</TabButton>
        <TabButton value="roadmap">Roadmap</TabButton>
      </Tabs>

      <div style={{ marginTop: 12 }}>
        <MotionFadeIn {...fadeInProps}>
          {tab === 'overview' && (
            <Text>
              Launch-ready design system powered by reusable primitives and
              strict accessibility checks.
            </Text>
          )}
          {tab === 'stats' && (
            <MotionSlideIn {...getSlideInProps('left')}>
              <div className="stack">
                <Progress value={72} />
                <Progress value={48} />
                <Progress value={91} />
              </div>
            </MotionSlideIn>
          )}
          {tab === 'roadmap' && (
            <div className="stack">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-10/12" />
              <Skeleton className="h-6 w-9/12" />
            </div>
          )}
        </MotionFadeIn>
      </div>

      <div className="footer-note">
        This demo intentionally combines multiple packages in one
        marketing-grade page.
      </div>
    </Card>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <main className="showcase">
        <section className="hero">
          <HeaderBar />
          <p>
            One-page product demo for sales calls, docs front page, or launch
            campaigns. Includes atoms, molecules, organisms, hooks, themes,
            animations, and form integrations.
          </p>
        </section>

        <section className="grid">
          <LeadFormCard />
          <ComponentGalleryCard />
          <HooksPlaygroundCard />
          <MotionCard />
        </section>

        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Call to Action</h2>
          <p>
            Ready for production pipelines, semantic versioning and visual
            testing.
          </p>
          <div className="row">
            <Button>
              <Icon name="star" size={16} />
              &nbsp;Start Building
            </Button>
            <Link href="#">Read Documentation</Link>
          </div>
        </section>
      </main>
    </ThemeProvider>
  );
}
