export interface TraceSpanItem {
  id: string;
  agentNodeId: string;
  spanType: 'LLM_CALL' | 'MCP_TOOL' | 'HANDOFF' | 'COMPACTION';
  toolName?: string;
  redactedArgsJson: string;
  handoffSummary?: {
    passedKeys: string[];
    droppedKeys: string[];
    compactedTokensSaved: number;
  };
  costMicros: number; // Axis 4: Strictly integer micro-dollars
  tokensUsed: number;
  startTimeMs: number;
  endTimeMs?: number;
  isBottleneck: boolean;
}

export interface ApprovalGateItem {
  id: string;
  agentNodeId: string;
  version: number; // Axis 1: Atomic Compare-And-Swap version
  riskLevel: 'MODERATE' | 'HIGH' | 'CRITICAL';
  actionSummary: string;
  unifiedDiff?: string;
}

export interface AgentNodeTelemetry {
  id: string;
  runId: string;
  parentAgentId: string | null;
  agentRole: string;
  stepStatus:
    | 'IDLE'
    | 'RUNNING'
    | 'WAITING_HANDOFF'
    | 'APPROVAL_REQUIRED'
    | 'SUCCEEDED'
    | 'FAILED';
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  retryAttempt: number;
  selfCostMicros: number;
  subtreeCostMicros: number;
  tokensUsed: number;
  contextLimitTokens: number;
  contextUsageBps: number;
  durationMs: number;
}

export interface ApprovalDecisionInput {
  gateId: string;
  expectedVersion: number;
  idempotencyKey: string;
  decision: 'APPROVED' | 'REJECTED' | 'STEERED';
  steerInstruction?: string;
  channel: 'WEB_CONTROL_ROOM' | 'TELEGRAM_BOT';
}

export interface AgentControlRoomProps {
  runId: string;
  nodes: readonly AgentNodeTelemetry[];
  spans: readonly TraceSpanItem[];
  pendingGates: readonly ApprovalGateItem[];
  selectedNodeId?: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onDecideGate: (decision: ApprovalDecisionInput) => Promise<void>;
  onRetryNode?: (nodeId: string, idempotencyKey: string) => Promise<void>;
  className?: string;
  'data-testid'?: string;
  'data-analytics-id'?: string;
}
