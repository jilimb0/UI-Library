import { z } from 'zod';

export const AgentStepStatusSchema = z.enum([
  'IDLE',
  'RUNNING',
  'WAITING_HANDOFF',
  'APPROVAL_REQUIRED',
  'SUCCEEDED',
  'FAILED',
]);

export const CircuitStateSchema = z.enum(['CLOSED', 'OPEN', 'HALF_OPEN']);

export const SpanTypeSchema = z.enum([
  'LLM_CALL',
  'MCP_TOOL',
  'HANDOFF',
  'COMPACTION',
]);

export const ApprovalRiskLevelSchema = z.enum(['MODERATE', 'HIGH', 'CRITICAL']);

export const ApprovalChannelSchema = z.enum([
  'WEB_CONTROL_ROOM',
  'TELEGRAM_BOT',
]);

export const AgentNodeTelemetrySchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid(),
  parentAgentId: z.string().uuid().nullable(),
  agentRole: z.string().min(1),
  stepStatus: AgentStepStatusSchema,
  circuitState: CircuitStateSchema,
  retryAttempt: z.number().int().nonnegative(),
  // Axis 4: Strictly integer micro-dollars and basis points
  selfCostMicros: z.number().int().nonnegative(),
  subtreeCostMicros: z.number().int().nonnegative(),
  tokensUsed: z.number().int().nonnegative(),
  contextLimitTokens: z.number().int().positive(),
  contextUsageBps: z.number().int().min(0).max(10000),
  durationMs: z.number().int().nonnegative(),
});

export const HandoffSummarySchema = z.object({
  passedKeys: z.array(z.string()),
  droppedKeys: z.array(z.string()),
  compactedTokensSaved: z.number().int().nonnegative(),
});

export const TraceSpanItemSchema = z.object({
  id: z.string(),
  agentNodeId: z.string(),
  spanType: SpanTypeSchema,
  toolName: z.string().optional(),
  redactedArgsJson: z.string(),
  handoffSummary: HandoffSummarySchema.optional(),
  costMicros: z.number().int().nonnegative(),
  tokensUsed: z.number().int().nonnegative(),
  startTimeMs: z.number().int().nonnegative(),
  endTimeMs: z.number().int().nonnegative().optional(),
  isBottleneck: z.boolean(),
});

export const ApprovalGateItemSchema = z.object({
  id: z.string(),
  agentNodeId: z.string(),
  version: z.number().int().positive(),
  riskLevel: ApprovalRiskLevelSchema,
  actionSummary: z.string(),
  unifiedDiff: z.string().optional(),
});

export const ApprovalDecisionInputSchema = z.object({
  gateId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().uuid(),
  decision: z.enum(['APPROVED', 'REJECTED', 'STEERED']),
  steerInstruction: z.string().max(2000).optional(),
  channel: ApprovalChannelSchema,
});

export type AgentStepStatus = z.infer<typeof AgentStepStatusSchema>;
export type CircuitState = z.infer<typeof CircuitStateSchema>;
export type SpanType = z.infer<typeof SpanTypeSchema>;
export type ApprovalRiskLevel = z.infer<typeof ApprovalRiskLevelSchema>;
export type ApprovalChannel = z.infer<typeof ApprovalChannelSchema>;
export type AgentNodeTelemetry = z.infer<typeof AgentNodeTelemetrySchema>;
export type HandoffSummary = z.infer<typeof HandoffSummarySchema>;
export type TraceSpanItem = z.infer<typeof TraceSpanItemSchema>;
export type ApprovalGateItem = z.infer<typeof ApprovalGateItemSchema>;
export type ApprovalDecisionInput = z.infer<typeof ApprovalDecisionInputSchema>;
