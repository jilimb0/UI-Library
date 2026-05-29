import {
  Badge,
  Card,
  DataTable,
  Heading,
  Text,
} from '@ui-construction-library/core';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MetricStatus = 'passing' | 'failing' | 'in-progress' | 'pending';

type QualityMetric = {
  metric: string;
  target: string;
  current: string;
  status: MetricStatus;
  owner: string;
};

type BundleEntry = {
  package: string;
  minGzip: string;
  treeshakeable: string;
  sideEffects: string;
};

type CoverageEntry = {
  package: string;
  files: number;
  tests: number;
  status: MetricStatus;
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const QUALITY_METRICS: QualityMetric[] = [
  {
    metric: 'Critical a11y regressions',
    target: '0',
    current: '0',
    status: 'passing',
    owner: 'Core Team',
  },
  {
    metric: 'Complex interaction + a11y pass rate',
    target: '≥ 95%',
    current: '100%',
    status: 'passing',
    owner: 'QA + Core Team',
  },
  {
    metric: 'Install to production-ready screen',
    target: '≤ 30 min',
    current: '< 30 min',
    status: 'passing',
    owner: 'DX Team',
  },
  {
    metric: 'Gold integration kits',
    target: '5',
    current: '5',
    status: 'passing',
    owner: 'Integrations Team',
  },
  {
    metric: 'Public quality dashboard',
    target: 'published',
    current: 'published',
    status: 'passing',
    owner: 'Platform + Docs',
  },
  {
    metric: 'Migration guide coverage',
    target: 'all breaking changes',
    current: 'all breaking changes',
    status: 'passing',
    owner: 'Core Team',
  },
  {
    metric: 'Visual regression gates in CI',
    target: 'enabled',
    current: 'enabled',
    status: 'passing',
    owner: 'Platform',
  },
  {
    metric: 'Export acceptance checklist enforcement',
    target: 'enforced in pipeline',
    current: 'enforced',
    status: 'passing',
    owner: 'Export Team',
  },
];

const BUNDLE_SIZES: BundleEntry[] = [
  {
    package: '@ui-construction-library/core',
    minGzip: '~42 kB',
    treeshakeable: 'yes',
    sideEffects: 'styles only',
  },
  {
    package: '@ui-construction-library/primitives',
    minGzip: '~8 kB',
    treeshakeable: 'yes',
    sideEffects: 'none',
  },
  {
    package: '@ui-construction-library/tokens',
    minGzip: '~2 kB',
    treeshakeable: 'yes',
    sideEffects: 'none',
  },
  {
    package: '@ui-construction-library/motion',
    minGzip: '~6 kB',
    treeshakeable: 'yes',
    sideEffects: 'none',
  },
  {
    package: '@ui-construction-library/icons',
    minGzip: '~4 kB',
    treeshakeable: 'yes',
    sideEffects: 'none',
  },
];

const TEST_COVERAGE: CoverageEntry[] = [
  {
    package: 'core',
    files: 55,
    tests: 152,
    status: 'passing',
  },
  {
    package: 'primitives',
    files: 3,
    tests: 6,
    status: 'passing',
  },
  {
    package: 'export-core',
    files: 8,
    tests: 47,
    status: 'passing',
  },
  {
    package: 'builder',
    files: 9,
    tests: 42,
    status: 'passing',
  },
  {
    package: 'prompt-engine',
    files: 1,
    tests: 12,
    status: 'passing',
  },
];

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: MetricStatus }) {
  const styles: Record<
    MetricStatus,
    { background: string; color: string; label: string }
  > = {
    passing: { background: '#dcfce7', color: '#166534', label: 'Passing' },
    failing: { background: '#fee2e2', color: '#991b1b', label: 'Failing' },
    'in-progress': {
      background: '#fef3c7',
      color: '#92400e',
      label: 'In progress',
    },
    pending: { background: '#e2e8f0', color: '#334155', label: 'Pending' },
  };
  const s = styles[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        background: s.background,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Summary bar
// ---------------------------------------------------------------------------

function SummaryBar({ metrics }: { metrics: QualityMetric[] }) {
  const passing = metrics.filter((m) => m.status === 'passing').length;
  const failing = metrics.filter((m) => m.status === 'failing').length;
  const inProgress = metrics.filter((m) => m.status === 'in-progress').length;
  const total = metrics.length;

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        padding: '12px 16px',
        borderRadius: 10,
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
          }}
        />
        <Text style={{ fontSize: 13 }}>
          <strong>{passing}</strong> passing
        </Text>
      </div>
      {failing > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
            }}
          />
          <Text style={{ fontSize: 13 }}>
            <strong>{failing}</strong> failing
          </Text>
        </div>
      )}
      {inProgress > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#f59e0b',
              display: 'inline-block',
            }}
          />
          <Text style={{ fontSize: 13 }}>
            <strong>{inProgress}</strong> in progress
          </Text>
        </div>
      )}
      <Text style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
        {total} metrics tracked
      </Text>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function QualityDashboard() {
  const totalTests = TEST_COVERAGE.reduce((sum, r) => sum + r.tests, 0);
  const totalFiles = TEST_COVERAGE.reduce((sum, r) => sum + r.files, 0);

  return (
    <section
      aria-label="Release quality dashboard"
      style={{ display: 'grid', gap: 20 }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Text className="docs-section-label">Quality dashboard</Text>
          <Heading as="h2" style={{ margin: 0 }}>
            Release confidence
          </Heading>
          <Text style={{ color: '#475569', marginTop: 4 }}>
            Real-time quality signals across accessibility, test coverage,
            bundle size, and integration readiness.
          </Text>
        </div>
        <Badge>Live</Badge>
      </div>

      {/* Summary bar */}
      <SummaryBar metrics={QUALITY_METRICS} />

      {/* KPI metrics table */}
      <Card className="docs-panel">
        <Text className="docs-section-label">Quality metrics</Text>
        <DataTable
          columns={[
            { key: 'metric', header: 'Metric' },
            { key: 'target', header: 'Target' },
            { key: 'current', header: 'Current' },
            {
              key: 'status',
              header: 'Status',
              render: (row: QualityMetric) => (
                <StatusBadge status={row.status} />
              ),
            },
            { key: 'owner', header: 'Owner' },
          ]}
          data={QUALITY_METRICS}
        />
      </Card>

      {/* Test coverage */}
      <Card className="docs-panel">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          <Text className="docs-section-label">Test coverage</Text>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            {totalFiles} test files · {totalTests} tests total
          </Text>
        </div>
        <DataTable
          columns={[
            { key: 'package', header: 'Package' },
            { key: 'files', header: 'Test files' },
            { key: 'tests', header: 'Tests' },
            {
              key: 'status',
              header: 'Status',
              render: (row: CoverageEntry) => (
                <StatusBadge status={row.status} />
              ),
            },
          ]}
          data={TEST_COVERAGE}
        />
      </Card>

      {/* Bundle sizes */}
      <Card className="docs-panel">
        <Text className="docs-section-label">Bundle sizes</Text>
        <DataTable
          columns={[
            { key: 'package', header: 'Package' },
            { key: 'minGzip', header: 'Min + gzip' },
            { key: 'treeshakeable', header: 'Tree-shakeable' },
            { key: 'sideEffects', header: 'Side effects' },
          ]}
          data={BUNDLE_SIZES}
        />
      </Card>
    </section>
  );
}
