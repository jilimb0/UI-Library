export type FloorplanNodeKind =
  | 'repo'
  | 'part'
  | 'screen'
  | 'endpoint'
  | 'file'
  | 'table'
  | 'external';

export type FloorplanEdgeKind =
  | 'import'
  | 'http_call'
  | 'db_access'
  | 'event_emit'
  | 'external_call'
  | 'local_ipc';

export interface FloorplanNode {
  readonly id: string;
  readonly repoId: string;
  readonly parentId: string | null;
  readonly kind: FloorplanNodeKind;
  readonly technicalName: string;
  readonly plainTitle: string;
  readonly plainSummary: string;
  readonly filePath: string | null;
  readonly httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly httpRoute?: string;
  readonly changedInLastCommit: boolean;
  readonly changeRationale?: string;
  readonly findingCountCritical: number;
  readonly findingCountHigh: number;
}

export interface FloorplanEdge {
  readonly id: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly kind: FloorplanEdgeKind;
  readonly isCrossRepo: boolean;
  readonly confidenceBps: number;
  readonly verifiedByContract: boolean;
}

export interface FloorplanFindingRef {
  readonly fingerprint: string;
  readonly nodeId: string;
  readonly udpaAxis:
    | 'axis_1'
    | 'axis_2'
    | 'axis_3'
    | 'axis_4'
    | 'axis_5'
    | 'axis_6';
  readonly severity: 'critical' | 'high' | 'medium' | 'low';
  readonly ruleId: string;
  readonly filePath: string;
  readonly line: number;
  readonly remediationPrompt: string;
}

export interface ArchitectureFloorplan {
  readonly schemaTag: 'gavel/floorplan@1';
  readonly mode: 'as_built' | 'prd_blueprint';
  readonly snapshotId: string;
  readonly generatedAtIso: string;
  readonly repositories: ReadonlyArray<{
    readonly repoId: string;
    readonly commitSha: string | null;
    readonly framework: string;
  }>;
  readonly nodes: ReadonlyArray<FloorplanNode>;
  readonly edges: ReadonlyArray<FloorplanEdge>;
  readonly findings: ReadonlyArray<FloorplanFindingRef>;
  readonly metrics: {
    readonly assignedFilesBps: number;
    readonly edgeResolutionCoverageBps: number;
    readonly unmatchedFrontendCallsCount: number;
    readonly aiLabelingCostMicroUsd: bigint;
    readonly scanDurationMs: number;
  };
}

export interface ArchitectureFloorplanProps {
  readonly graph: ArchitectureFloorplan;
  readonly viewMode: 'plain' | 'developer';
  readonly activeZoomNodeId: string | null;
  readonly highlightRecentWork?: boolean;
  readonly offlineCacheKey?: string;
  readonly onNodeSelect: (nodeId: string) => void;
  readonly onScreenTraceRequest?: (screenNodeId: string) => void;
  readonly ariaLabel: string;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly className?: string;
  readonly 'data-testid'?: string;
  readonly 'data-analytics-id'?: string;
}
