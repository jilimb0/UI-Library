import { z } from 'zod';

export const FloorplanNodeKindSchema = z.enum([
  'repo',
  'part',
  'screen',
  'endpoint',
  'file',
  'table',
  'external',
]);

export const FloorplanEdgeKindSchema = z.enum([
  'import',
  'http_call',
  'db_access',
  'event_emit',
  'external_call',
  'local_ipc',
]);

export const FloorplanNodeSchema = z.object({
  id: z.string().min(1).max(256),
  repoId: z.string().min(1),
  parentId: z.string().nullable(),
  kind: FloorplanNodeKindSchema,
  technicalName: z.string().min(1),
  plainTitle: z.string().min(1).max(120),
  plainSummary: z.string().max(400),
  filePath: z.string().nullable(),
  httpMethod: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
  httpRoute: z.string().optional(),
  changedInLastCommit: z.boolean().default(false),
  changeRationale: z.string().max(300).optional(),
  findingCountCritical: z.number().int().nonnegative().default(0),
  findingCountHigh: z.number().int().nonnegative().default(0),
});

export const FloorplanEdgeSchema = z.object({
  id: z.string().min(1),
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  kind: FloorplanEdgeKindSchema,
  isCrossRepo: z.boolean(),
  confidenceBps: z.number().int().min(0).max(10000),
  verifiedByContract: z.boolean(),
});

export const FloorplanFindingRefSchema = z.object({
  fingerprint: z.string().min(16).max(128),
  nodeId: z.string().min(1),
  udpaAxis: z.enum([
    'axis_1',
    'axis_2',
    'axis_3',
    'axis_4',
    'axis_5',
    'axis_6',
  ]),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  ruleId: z.string().min(1),
  filePath: z.string().min(1),
  line: z.number().int().positive(),
  remediationPrompt: z.string().max(600),
});

export const ArchitectureFloorplanSchema = z.object({
  schemaTag: z.literal('gavel/floorplan@1'),
  mode: z.enum(['as_built', 'prd_blueprint']),
  snapshotId: z.string().regex(/^[a-f0-9]{64}$/),
  generatedAtIso: z.string().datetime(),
  repositories: z.array(
    z.object({
      repoId: z.string().min(1),
      commitSha: z
        .string()
        .regex(/^[a-f0-9]{7,40}$/)
        .nullable(),
      framework: z.string().min(1),
    })
  ),
  nodes: z.array(FloorplanNodeSchema),
  edges: z.array(FloorplanEdgeSchema),
  findings: z.array(FloorplanFindingRefSchema),
  metrics: z.object({
    assignedFilesBps: z.number().int().min(0).max(10000),
    edgeResolutionCoverageBps: z.number().int().min(0).max(10000),
    unmatchedFrontendCallsCount: z.number().int().nonnegative(),
    aiLabelingCostMicroUsd: z.coerce.bigint().nonnegative(),
    scanDurationMs: z.number().int().nonnegative(),
  }),
});

export const GetFloorplanMcpInputSchema = z.object({
  repositoryIds: z.array(z.string().min(1)).min(1).max(25),
  zoomLevel: z.enum(['ecosystem', 'repo', 'part', 'file']).default('part'),
  focusScreenId: z.string().min(1).optional(),
  onlyChangedSinceCommit: z
    .string()
    .regex(/^[a-f0-9]{7,40}$/)
    .optional(),
  includeUnmatchedEdges: z.boolean().default(true),
});

export type FloorplanNodeKind = z.infer<typeof FloorplanNodeKindSchema>;
export type FloorplanEdgeKind = z.infer<typeof FloorplanEdgeKindSchema>;
export type FloorplanNode = z.infer<typeof FloorplanNodeSchema>;
export type FloorplanEdge = z.infer<typeof FloorplanEdgeSchema>;
export type FloorplanFindingRef = z.infer<typeof FloorplanFindingRefSchema>;
export type ArchitectureFloorplan = z.infer<typeof ArchitectureFloorplanSchema>;
export type GetFloorplanMcpInput = z.infer<typeof GetFloorplanMcpInputSchema>;
