import { describe, expect, it } from 'vitest';
import {
  ArchitectureFloorplanSchema,
  FloorplanEdgeKindSchema,
  FloorplanNodeKindSchema,
  GetFloorplanMcpInputSchema,
} from './index';

describe('architecture-floorplan.schema', () => {
  const validGraph = {
    schemaTag: 'gavel/floorplan@1' as const,
    mode: 'as_built' as const,
    snapshotId: 'a'.repeat(64),
    generatedAtIso: '2026-11-24T08:00:00.000Z',
    repositories: [
      {
        repoId: 'web-app',
        commitSha: '1234567',
        framework: 'react',
      },
    ],
    nodes: [
      {
        id: 'web-app:src/screens/Home.tsx#screen',
        repoId: 'web-app',
        parentId: null,
        kind: 'screen' as const,
        technicalName: 'src/screens/Home.tsx',
        plainTitle: 'Home Screen',
        plainSummary: 'Landing screen',
        filePath: 'src/screens/Home.tsx',
        changedInLastCommit: true,
        changeRationale: 'Added orders query',
        findingCountCritical: 0,
        findingCountHigh: 1,
      },
    ],
    edges: [
      {
        id: 'edge-1',
        sourceNodeId: 'web-app:src/screens/Home.tsx#screen',
        targetNodeId: 'api:orders#GET:/api/orders',
        kind: 'http_call' as const,
        isCrossRepo: true,
        confidenceBps: 10000,
        verifiedByContract: true,
      },
    ],
    findings: [
      {
        fingerprint: 'fp-1234567890abcdef',
        nodeId: 'web-app:src/screens/Home.tsx#screen',
        udpaAxis: 'axis_5' as const,
        severity: 'high' as const,
        ruleId: 'NO_PII_LOGS',
        filePath: 'src/screens/Home.tsx',
        line: 14,
        remediationPrompt: 'Redact email before logging.',
      },
    ],
    metrics: {
      assignedFilesBps: 9500,
      edgeResolutionCoverageBps: 8750,
      unmatchedFrontendCallsCount: 1,
      aiLabelingCostMicroUsd: '2500',
      scanDurationMs: 42,
    },
  };

  it('validates node kinds, edge kinds, and valid floorplan graphs with BigInt coercion', () => {
    expect(FloorplanNodeKindSchema.safeParse('screen').success).toBe(true);
    expect(FloorplanEdgeKindSchema.safeParse('local_ipc').success).toBe(true);

    const parsed = ArchitectureFloorplanSchema.parse(validGraph);
    expect(parsed.schemaTag).toBe('gavel/floorplan@1');
    expect(parsed.metrics.aiLabelingCostMicroUsd).toBe(2500n);
  });

  it('rejects float bps values or out-of-range confidenceBps', () => {
    const invalidFloat = {
      ...validGraph,
      metrics: { ...validGraph.metrics, assignedFilesBps: 95.5 },
    };
    expect(ArchitectureFloorplanSchema.safeParse(invalidFloat).success).toBe(
      false
    );

    const outOfRange = {
      ...validGraph,
      edges: [{ ...validGraph.edges[0], confidenceBps: 12000 }],
    };
    expect(ArchitectureFloorplanSchema.safeParse(outOfRange).success).toBe(
      false
    );
  });

  it('validates GetFloorplanMcpInputSchema', () => {
    const parsed = GetFloorplanMcpInputSchema.parse({
      repositoryIds: ['web-app', 'api-app'],
      focusScreenId: 'web-app:src/screens/Home.tsx#screen',
    });
    expect(parsed.zoomLevel).toBe('part');
    expect(parsed.includeUnmatchedEdges).toBe(true);
    expect(
      GetFloorplanMcpInputSchema.safeParse({ repositoryIds: [] }).success
    ).toBe(false);
  });
});
