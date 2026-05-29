import {
  Badge,
  Button,
  Card,
  DataTable,
  Dropdown,
  Heading,
  Text,
} from '@ui-construction-library/core';
import { useState } from 'react';

type Project = {
  id: string;
  name: string;
  status: 'active' | 'archived' | 'draft';
  revenue: string;
  users: number;
};

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Aurora Analytics',
    status: 'active',
    revenue: '$124k',
    users: 8420,
  },
  { id: '2', name: 'Nebula CRM', status: 'draft', revenue: '$0', users: 0 },
  {
    id: '3',
    name: 'Orbit Ops',
    status: 'active',
    revenue: '$89k',
    users: 3120,
  },
  {
    id: '4',
    name: 'Pulsar Sync',
    status: 'archived',
    revenue: '$45k',
    users: 1200,
  },
  {
    id: '5',
    name: 'Quasar BI',
    status: 'active',
    revenue: '$210k',
    users: 15400,
  },
];

const STATUS_VARIANT: Record<
  Project['status'],
  'success' | 'warning' | 'default'
> = {
  active: 'success',
  draft: 'warning',
  archived: 'default',
};

export function DashboardShellDemo() {
  const [filter, setFilter] = useState<string>('all');

  const filtered =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.status === filter);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* KPI cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
      >
        {[
          { label: 'Total revenue', value: '$468k', change: '+12%' },
          { label: 'Active users', value: '28,140', change: '+5%' },
          { label: 'Projects', value: '5', change: '0' },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <Text
              style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
            >
              {kpi.label}
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                marginTop: '0.25rem',
              }}
            >
              <Heading as="h4">{kpi.value}</Heading>
              <Text style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                {kpi.change}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Heading as="h4">Projects</Heading>
        <Dropdown
          size="sm"
          items={[
            { id: 'all', label: 'All statuses', value: 'all' },
            { id: 'active', label: 'Active', value: 'active' },
            { id: 'draft', label: 'Draft', value: 'draft' },
            { id: 'archived', label: 'Archived', value: 'archived' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value)}
          placeholder="Filter by status"
        />
      </div>

      {/* Table */}
      <DataTable<Project>
        data={filtered}
        columns={[
          { key: 'name', header: 'Project', sortable: true },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
            ),
          },
          { key: 'revenue', header: 'Revenue', sortable: true },
          { key: 'users', header: 'Users', sortable: true },
          {
            key: 'id',
            header: '',
            render: () => (
              <Button size="sm" variant="ghost">
                Open
              </Button>
            ),
          },
        ]}
        pageSize={5}
      />
    </div>
  );
}
