import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ArchitectureFloorplan } from './ArchitectureFloorplan';
import type { ArchitectureFloorplan as ArchitectureFloorplanData } from './types';

const MOCK_GRAPH: ArchitectureFloorplanData = {
  schemaTag: 'gavel/floorplan@1',
  mode: 'as_built',
  snapshotId: 'b'.repeat(64),
  generatedAtIso: '2026-11-24T08:00:00.000Z',
  repositories: [
    { repoId: 'web-app', commitSha: '1234567', framework: 'react' },
    { repoId: 'api-app', commitSha: 'abcdef1', framework: 'hono' },
  ],
  nodes: [
    {
      id: 'web-app:repo',
      repoId: 'web-app',
      parentId: null,
      kind: 'repo',
      technicalName: 'web-app',
      plainTitle: 'Web Frontend',
      plainSummary: 'Customer storefront UI',
      filePath: null,
      changedInLastCommit: false,
      findingCountCritical: 0,
      findingCountHigh: 0,
    },
    {
      id: 'web-app:src/screens/Checkout.tsx#screen',
      repoId: 'web-app',
      parentId: 'web-app:repo',
      kind: 'screen',
      technicalName: 'src/screens/Checkout.tsx',
      plainTitle: 'Checkout Screen',
      plainSummary: 'Collects payment and submits order',
      filePath: 'src/screens/Checkout.tsx',
      changedInLastCommit: true,
      changeRationale: 'Updated idempotency key header',
      findingCountCritical: 0,
      findingCountHigh: 1,
    },
    {
      id: 'api-app:src/routes/orders.ts#POST:/api/orders',
      repoId: 'api-app',
      parentId: null,
      kind: 'endpoint',
      technicalName: 'POST /api/orders',
      plainTitle: 'Create Order API',
      plainSummary: 'Persists order in PostgreSQL',
      filePath: 'src/routes/orders.ts',
      httpMethod: 'POST',
      httpRoute: '/api/orders',
      changedInLastCommit: false,
      findingCountCritical: 0,
      findingCountHigh: 0,
    },
  ],
  edges: [
    {
      id: 'edge-checkout-orders',
      sourceNodeId: 'web-app:src/screens/Checkout.tsx#screen',
      targetNodeId: 'api-app:src/routes/orders.ts#POST:/api/orders',
      kind: 'http_call',
      isCrossRepo: true,
      confidenceBps: 10000,
      verifiedByContract: true,
    },
  ],
  findings: [
    {
      fingerprint: 'fp-1234567890abcdef',
      nodeId: 'web-app:src/screens/Checkout.tsx#screen',
      udpaAxis: 'axis_1',
      severity: 'high',
      ruleId: 'REQUIRE_IDEMPOTENCY_KEY',
      filePath: 'src/screens/Checkout.tsx',
      line: 22,
      remediationPrompt: 'Pass Idempotency-Key header on POST /api/orders.',
    },
  ],
  metrics: {
    assignedFilesBps: 9525,
    edgeResolutionCoverageBps: 10000,
    unmatchedFrontendCallsCount: 0,
    aiLabelingCostMicroUsd: 15000n,
    scanDurationMs: 38,
  },
};

describe('ArchitectureFloorplan Component', () => {
  it('renders WAI-ARIA region, KPI metrics in integer-derived formatting, and supports plain vs developer modes', () => {
    const onNodeSelect = vi.fn();

    const { rerender } = render(
      <ArchitectureFloorplan
        graph={MOCK_GRAPH}
        viewMode="plain"
        activeZoomNodeId={null}
        highlightRecentWork
        onNodeSelect={onNodeSelect}
        ariaLabel="Ecosystem Architecture Map"
      />
    );

    expect(
      screen.getByRole('region', { name: 'Ecosystem Architecture Map' })
    ).toBeInTheDocument();
    expect(screen.getByText('95.25%')).toBeInTheDocument();
    expect(screen.getByText('100.00%')).toBeInTheDocument();
    expect(screen.getByText('$0.0150')).toBeInTheDocument();
    expect(screen.getAllByText('Checkout Screen').length).toBeGreaterThan(0);

    rerender(
      <ArchitectureFloorplan
        graph={MOCK_GRAPH}
        viewMode="developer"
        activeZoomNodeId="web-app:repo"
        highlightRecentWork
        onNodeSelect={onNodeSelect}
        ariaLabel="Ecosystem Architecture Map"
      />
    );

    expect(
      screen.getAllByText('src/screens/Checkout.tsx').length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/recent commit/i)).toBeInTheDocument();
  });

  it('triggers onNodeSelect and onScreenTraceRequest and renders findings drawer', () => {
    const onNodeSelect = vi.fn();
    const onScreenTraceRequest = vi.fn();

    render(
      <ArchitectureFloorplan
        graph={MOCK_GRAPH}
        viewMode="plain"
        activeZoomNodeId="web-app:repo"
        onNodeSelect={onNodeSelect}
        onScreenTraceRequest={onScreenTraceRequest}
        ariaLabel="Floorplan"
      />
    );

    const traceBtn = screen.getByRole('button', {
      name: /trace screen-to-db/i,
    });
    fireEvent.click(traceBtn);
    expect(onScreenTraceRequest).toHaveBeenCalledWith(
      'web-app:src/screens/Checkout.tsx#screen'
    );

    const inspectBtn = screen.getByRole('button', {
      name: /inspect checkout screen/i,
    });
    fireEvent.click(inspectBtn);
    expect(onNodeSelect).toHaveBeenCalledWith(
      'web-app:src/screens/Checkout.tsx#screen'
    );
    expect(screen.getByText('REQUIRE_IDEMPOTENCY_KEY')).toBeInTheDocument();
  });

  it('renders Loading, Error, and Empty states safely', () => {
    const onNodeSelect = vi.fn();
    const { rerender } = render(
      <ArchitectureFloorplan
        graph={MOCK_GRAPH}
        viewMode="plain"
        activeZoomNodeId={null}
        onNodeSelect={onNodeSelect}
        ariaLabel="Floorplan"
        loading
      />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <ArchitectureFloorplan
        graph={MOCK_GRAPH}
        viewMode="plain"
        activeZoomNodeId={null}
        onNodeSelect={onNodeSelect}
        ariaLabel="Floorplan"
        error="Failed to load snapshot"
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Failed to load snapshot'
    );

    rerender(
      <ArchitectureFloorplan
        graph={{ ...MOCK_GRAPH, nodes: [], edges: [] }}
        viewMode="plain"
        activeZoomNodeId={null}
        onNodeSelect={onNodeSelect}
        ariaLabel="Floorplan"
      />
    );
    expect(screen.getByText(/no architecture nodes/i)).toBeInTheDocument();
  });
});
