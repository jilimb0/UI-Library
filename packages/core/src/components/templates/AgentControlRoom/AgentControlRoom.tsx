import { useId, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Drawer } from '../../organisms/Drawer/Drawer';
import { KpiCard } from '../../organisms/KpiCard/KpiCard';
import { Timeline } from '../../organisms/Timeline/Timeline';
import { type TreeNode, TreeView } from '../../organisms/TreeView/TreeView';
import type {
  AgentControlRoomProps,
  AgentNodeTelemetry,
} from './AgentControlRoom.types';

function formatMicros(micros: number): string {
  const dollars = Math.floor(micros / 1_000_000);
  const remainder = String(micros % 1_000_000).padStart(6, '0');
  return `$${dollars}.${remainder.slice(0, 4)}`;
}

export function AgentControlRoom({
  runId,
  nodes,
  spans,
  pendingGates,
  selectedNodeId,
  onSelectNode,
  onDecideGate,
  onRetryNode,
  className,
  'data-testid': testId = 'agent-control-room',
  'data-analytics-id': analyticsId = 'agent-control-room',
}: AgentControlRoomProps) {
  const uid = useId();
  const [steerTexts, setSteerTexts] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Calculate Aggregate Roll-ups
  const rootNode = useMemo(
    () => nodes.find((n) => n.parentAgentId === null) ?? nodes[0],
    [nodes]
  );

  const totalCostMicros = useMemo(
    () =>
      rootNode
        ? rootNode.subtreeCostMicros
        : nodes.reduce((sum, n) => sum + n.selfCostMicros, 0),
    [rootNode, nodes]
  );

  const totalTokens = useMemo(
    () => nodes.reduce((sum, n) => sum + n.tokensUsed, 0),
    [nodes]
  );

  const activeCircuitBreaker = useMemo(
    () => nodes.find((n) => n.circuitState !== 'CLOSED'),
    [nodes]
  );

  // 2. Build Tree Hierarchy for TreeView
  const treeNodes = useMemo(() => {
    const nodeMap = new Map<string, TreeNode & { raw: AgentNodeTelemetry }>();
    for (const node of nodes) {
      nodeMap.set(node.id, {
        id: node.id,
        label: `${node.agentRole} [${node.stepStatus}] — ${formatMicros(node.subtreeCostMicros)}`,
        children: [],
        raw: node,
      });
    }

    const roots: TreeNode[] = [];
    for (const node of nodes) {
      const treeNode = nodeMap.get(node.id)!;
      if (node.parentAgentId && nodeMap.has(node.parentAgentId)) {
        nodeMap.get(node.parentAgentId)!.children!.push(treeNode);
      } else {
        roots.push(treeNode);
      }
    }
    return roots;
  }, [nodes]);

  // 3. Spans filtered by selectedNodeId or all
  const displayedSpans = useMemo(() => {
    if (!selectedNodeId) return spans;
    return spans.filter((s) => s.agentNodeId === selectedNodeId);
  }, [spans, selectedNodeId]);

  const timelineItems = useMemo(
    () =>
      displayedSpans.map((s) => ({
        id: s.id,
        title: `${s.spanType}${s.toolName ? `: ${s.toolName}` : ''}${s.isBottleneck ? ' ⚠️ BOTTLENECK' : ''}`,
        description: (
          <div>
            <div>
              Cost: {formatMicros(s.costMicros)} | Tokens: {s.tokensUsed}
            </div>
            <pre
              style={{
                margin: '4px 0',
                fontSize: '11px',
                maxHeight: '100px',
                overflow: 'auto',
              }}
            >
              {s.redactedArgsJson}
            </pre>
          </div>
        ),
        timestamp: `${s.startTimeMs ? new Date(s.startTimeMs).toLocaleTimeString() : ''}`,
      })),
    [displayedSpans]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const handleDecision = async (
    gateId: string,
    version: number,
    decision: 'APPROVED' | 'REJECTED' | 'STEERED'
  ) => {
    const idempotencyKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setIsSubmitting(true);
    try {
      await onDecideGate({
        gateId,
        expectedVersion: version,
        idempotencyKey,
        decision,
        steerInstruction: steerTexts[gateId] || undefined,
        channel: 'WEB_CONTROL_ROOM',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id={`${uid}-control-room`}
      className={cn('agent-control-room', className)}
      data-testid={testId}
      data-analytics-id={analyticsId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
      }}
    >
      {/* Top Roll-Up KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <KpiCard
          label="Total Cost"
          value={formatMicros(totalCostMicros)}
          subtext="Integer micro-dollar roll-up"
        />
        <KpiCard
          label="Total Tokens"
          value={totalTokens.toLocaleString()}
          subtext="Across all subagent branches"
        />
        <KpiCard
          label="Circuit Breaker"
          value={
            activeCircuitBreaker
              ? `${activeCircuitBreaker.agentRole}: ${activeCircuitBreaker.circuitState}`
              : 'ALL CLOSED'
          }
          variant={activeCircuitBreaker ? 'warning' : 'success'}
        />
        <KpiCard
          label="Active Run"
          value={runId.slice(0, 8)}
          subtext={`${nodes.length} nodes, ${pendingGates.length} gates`}
        />
      </div>

      {/* Human-in-the-loop Approval Gate Banner */}
      {pendingGates.length > 0 && (
        <section
          aria-live="assertive"
          aria-label="Human-in-the-loop Approval Required"
          style={{
            border: '2px solid var(--ucl-color-warning, #f59e0b)',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'var(--ucl-color-warning-subtle, #fef3c7)',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>
            Approval Required ({pendingGates.length} pending)
          </h3>
          {pendingGates.map((gate) => (
            <div
              key={gate.id}
              style={{
                marginBottom: '12px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '8px',
              }}
            >
              <div>
                <strong>[{gate.riskLevel}]</strong> {gate.actionSummary}{' '}
                (Version: {gate.version})
              </div>
              {gate.unifiedDiff && (
                <pre
                  style={{
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '8px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px',
                  }}
                >
                  {gate.unifiedDiff}
                </pre>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  alignItems: 'center',
                }}
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    handleDecision(gate.id, gate.version, 'APPROVED')
                  }
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    handleDecision(gate.id, gate.version, 'REJECTED')
                  }
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
                <input
                  type="text"
                  placeholder="Optional steer instructions..."
                  value={steerTexts[gate.id] || ''}
                  onChange={(e) =>
                    setSteerTexts({ ...steerTexts, [gate.id]: e.target.value })
                  }
                  style={{
                    padding: '6px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    flex: 1,
                  }}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    handleDecision(gate.id, gate.version, 'STEERED')
                  }
                  style={{
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Steer
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Main Dual-Pane Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) 2fr',
          gap: '16px',
        }}
      >
        {/* Topology Tree */}
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>Agent Topology</h4>
          <TreeView
            nodes={treeNodes}
            onSelect={(treeNode) =>
              onSelectNode(treeNode.id === selectedNodeId ? null : treeNode.id)
            }
          />
        </div>

        {/* Trace Waterfall */}
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>
            Trace Waterfall{' '}
            {selectedNodeId
              ? `(Filtered for ${selectedNode?.agentRole})`
              : '(All Spans)'}
          </h4>
          <Timeline items={timelineItems} />
        </div>
      </div>

      {/* Right Drawer Inspector */}
      <Drawer
        open={Boolean(selectedNode)}
        onOpenChange={(open) => {
          if (!open) onSelectNode(null);
        }}
        title={
          selectedNode
            ? `${selectedNode.agentRole} Telemetry`
            : 'Agent Inspector'
        }
      >
        {selectedNode && (
          <div
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <strong>Status:</strong> {selectedNode.stepStatus}
            </div>
            <div>
              <strong>Circuit State:</strong> {selectedNode.circuitState}{' '}
              (Attempt: {selectedNode.retryAttempt})
            </div>
            <div>
              <strong>Self Cost:</strong>{' '}
              {formatMicros(selectedNode.selfCostMicros)}
            </div>
            <div>
              <strong>Subtree Cost:</strong>{' '}
              {formatMicros(selectedNode.subtreeCostMicros)}
            </div>
            <div>
              <strong>Tokens Used:</strong> {selectedNode.tokensUsed} /{' '}
              {selectedNode.contextLimitTokens} (
              {selectedNode.contextUsageBps / 100}%)
            </div>
            <div>
              <strong>Duration:</strong> {selectedNode.durationMs}ms
            </div>
            {onRetryNode && selectedNode.stepStatus === 'FAILED' && (
              <button
                type="button"
                onClick={() => {
                  const key = `retry-${Date.now()}`;
                  onRetryNode(selectedNode.id, key);
                }}
                style={{
                  padding: '8px 12px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Retry Node
              </button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
