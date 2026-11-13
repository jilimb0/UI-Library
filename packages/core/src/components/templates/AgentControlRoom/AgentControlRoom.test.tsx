import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgentControlRoom } from './AgentControlRoom';
import type {
  AgentNodeTelemetry,
  ApprovalGateItem,
  TraceSpanItem,
} from './AgentControlRoom.types';

const MOCK_NODES: AgentNodeTelemetry[] = [
  {
    id: 'node-orch',
    runId: 'run-1',
    parentAgentId: null,
    agentRole: 'Orchestrator',
    stepStatus: 'RUNNING',
    circuitState: 'CLOSED',
    retryAttempt: 0,
    selfCostMicros: 25000,
    subtreeCostMicros: 125000,
    tokensUsed: 1500,
    contextLimitTokens: 128000,
    contextUsageBps: 117,
    durationMs: 3200,
  },
  {
    id: 'node-sub',
    runId: 'run-1',
    parentAgentId: 'node-orch',
    agentRole: 'DeterministicScanner',
    stepStatus: 'APPROVAL_REQUIRED',
    circuitState: 'CLOSED',
    retryAttempt: 0,
    selfCostMicros: 100000,
    subtreeCostMicros: 100000,
    tokensUsed: 4000,
    contextLimitTokens: 128000,
    contextUsageBps: 312,
    durationMs: 2100,
  },
];

const MOCK_GATES: ApprovalGateItem[] = [
  {
    id: 'gate-1',
    agentNodeId: 'node-sub',
    version: 1,
    riskLevel: 'HIGH',
    actionSummary: 'Apply high-confidence patch to auth middleware',
    unifiedDiff:
      '--- a/auth.ts\n+++ b/auth.ts\n- timingUnsafe()\n+ timingSafeEqual()',
  },
];

const MOCK_SPANS: TraceSpanItem[] = [
  {
    id: 'span-1',
    agentNodeId: 'node-sub',
    spanType: 'MCP_TOOL',
    toolName: 'gavel_settle_patches',
    redactedArgsJson: '{"dryRun":true,"targetPath":"src/auth.ts"}',
    costMicros: 15000,
    tokensUsed: 450,
    startTimeMs: 1730000000000,
    isBottleneck: true,
  },
];

describe('AgentControlRoom Component', () => {
  it('renders roll-ups, topology nodes, and approval gate with WAI-ARIA region', () => {
    const onSelectNode = vi.fn();
    const onDecideGate = vi.fn().mockResolvedValue(undefined);

    render(
      <AgentControlRoom
        runId="run-1"
        nodes={MOCK_NODES}
        spans={MOCK_SPANS}
        pendingGates={MOCK_GATES}
        onSelectNode={onSelectNode}
        onDecideGate={onDecideGate}
      />
    );

    expect(screen.getByTestId('agent-control-room')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /approval required/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/apply high-confidence patch/i)
    ).toBeInTheDocument();
  });

  it('triggers onDecideGate with atomic expectedVersion when Approve is clicked', async () => {
    const onSelectNode = vi.fn();
    const onDecideGate = vi.fn().mockResolvedValue(undefined);

    render(
      <AgentControlRoom
        runId="run-1"
        nodes={MOCK_NODES}
        spans={MOCK_SPANS}
        pendingGates={MOCK_GATES}
        onSelectNode={onSelectNode}
        onDecideGate={onDecideGate}
      />
    );

    const approveButton = screen.getByRole('button', { name: /^approve$/i });
    fireEvent.click(approveButton);

    expect(onDecideGate).toHaveBeenCalledTimes(1);
    expect(onDecideGate).toHaveBeenCalledWith(
      expect.objectContaining({
        gateId: 'gate-1',
        expectedVersion: 1,
        decision: 'APPROVED',
        channel: 'WEB_CONTROL_ROOM',
      })
    );
  });
});
