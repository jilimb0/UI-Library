import {
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  DatePicker,
  Dropdown,
  Heading,
  Input,
  Modal,
  Progress,
  RadioButton,
  Select,
  Text,
  TextArea,
  Toast,
  Tooltip,
} from '@ui-construction-library/core';
import { Kanban } from '@ui-construction-library/dnd';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { SectionIntro } from './SectionIntro';

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

export function ComponentGalleryCard() {
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
