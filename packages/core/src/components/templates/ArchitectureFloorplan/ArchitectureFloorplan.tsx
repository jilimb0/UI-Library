import { useEffect, useId, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Drawer } from '../../organisms/Drawer/Drawer';
import { KpiCard } from '../../organisms/KpiCard/KpiCard';
import { Timeline } from '../../organisms/Timeline/Timeline';
import { type TreeNode, TreeView } from '../../organisms/TreeView/TreeView';
import type { ArchitectureFloorplanProps, FloorplanNode } from './types';

function formatBpsPercent(bps: number): string {
  const safe = Math.max(0, Math.min(10000, Math.trunc(bps)));
  const whole = Math.floor(safe / 100);
  const frac = String(safe % 100).padStart(2, '0');
  return `${whole}.${frac}%`;
}

function formatMicroUsd(micros: bigint): string {
  const safe = micros < 0n ? 0n : micros;
  const dollars = safe / 1_000_000n;
  const frac = String(safe % 1_000_000n)
    .padStart(6, '0')
    .slice(0, 4);
  return `$${dollars.toString()}.${frac}`;
}

function persistOfflineZoomState(
  cacheKey: string,
  zoomNodeId: string | null
): void {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return;
  }
  try {
    const req = indexedDB.open('ucl-architecture-floorplan', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('zoom_state')) {
        db.createObjectStore('zoom_state');
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('zoom_state', 'readwrite');
      tx.objectStore('zoom_state').put(
        { zoomNodeId, updatedAtMs: Date.now() },
        cacheKey
      );
    };
  } catch {
    // Gracefully ignore IndexedDB restrictions in private browsing / headless tests
  }
}

function buildTreeNodes(
  nodes: ReadonlyArray<FloorplanNode>,
  viewMode: 'plain' | 'developer'
): TreeNode[] {
  const map = new Map<string, TreeNode>();
  for (const node of nodes) {
    const label = viewMode === 'plain' ? node.plainTitle : node.technicalName;
    map.set(node.id, {
      id: node.id,
      label: `${label} [${node.kind}]`,
      children: [],
    });
  }

  const roots: TreeNode[] = [];
  for (const node of nodes) {
    const treeNode = map.get(node.id)!;
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children!.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }
  return roots;
}

export function ArchitectureFloorplan({
  graph,
  viewMode,
  activeZoomNodeId,
  highlightRecentWork = false,
  offlineCacheKey,
  onNodeSelect,
  onScreenTraceRequest,
  ariaLabel,
  loading = false,
  error = null,
  className,
  'data-testid': testId = 'architecture-floorplan',
  'data-analytics-id': analyticsId = 'architecture-floorplan',
}: ArchitectureFloorplanProps) {
  const headingId = useId();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (offlineCacheKey) {
      persistOfflineZoomState(offlineCacheKey, activeZoomNodeId);
    }
  }, [offlineCacheKey, activeZoomNodeId]);

  const nodeById = useMemo(() => {
    const map = new Map<string, FloorplanNode>();
    for (const node of graph.nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [graph.nodes]);

  const visibleNodes = useMemo(() => {
    if (!activeZoomNodeId) {
      return graph.nodes;
    }
    const children = graph.nodes.filter(
      (node) =>
        node.parentId === activeZoomNodeId || node.id === activeZoomNodeId
    );
    return children.length > 0 ? children : graph.nodes;
  }, [graph.nodes, activeZoomNodeId]);

  const treeNodes = useMemo(
    () => buildTreeNodes(visibleNodes, viewMode),
    [visibleNodes, viewMode]
  );

  const selectedNode = selectedNodeId
    ? (nodeById.get(selectedNodeId) ?? null)
    : null;

  const selectedFindings = useMemo(() => {
    if (!selectedNodeId) return [];
    return graph.findings.filter((f) => f.nodeId === selectedNodeId);
  }, [graph.findings, selectedNodeId]);

  const selectedEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return graph.edges.filter(
      (e) =>
        e.sourceNodeId === selectedNodeId || e.targetNodeId === selectedNodeId
    );
  }, [graph.edges, selectedNodeId]);

  const handleInspectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onNodeSelect(nodeId);
  };

  if (loading) {
    return (
      <section
        aria-label={ariaLabel}
        aria-busy="true"
        role="status"
        data-testid={testId}
        data-analytics-id={analyticsId}
        className={cn('p-4 rounded-[var(--ucl-radius-lg,12px)]', className)}
        style={{
          backgroundColor: 'var(--ucl-surface, transparent)',
          color: 'var(--ucl-foreground, inherit)',
        }}
      >
        <p>Loading architecture floorplan...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        aria-label={ariaLabel}
        role="alert"
        data-testid={testId}
        data-analytics-id={analyticsId}
        className={cn('p-4 rounded-[var(--ucl-radius-lg,12px)]', className)}
        style={{
          backgroundColor: 'var(--ucl-surface, transparent)',
          color: 'var(--ucl-danger-foreground, inherit)',
        }}
      >
        <p>{error}</p>
      </section>
    );
  }

  if (graph.nodes.length === 0) {
    return (
      <section
        aria-label={ariaLabel}
        data-testid={testId}
        data-analytics-id={analyticsId}
        className={cn('p-4 rounded-[var(--ucl-radius-lg,12px)]', className)}
        style={{
          backgroundColor: 'var(--ucl-surface, transparent)',
          color: 'var(--ucl-muted-foreground, inherit)',
        }}
      >
        <p>No architecture nodes discovered in this snapshot.</p>
      </section>
    );
  }

  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={headingId}
      data-testid={testId}
      data-analytics-id={analyticsId}
      className={cn('flex flex-col gap-4 p-4', className)}
      style={{
        backgroundColor: 'var(--ucl-background, transparent)',
        color: 'var(--ucl-foreground, inherit)',
      }}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id={headingId} className="text-base font-semibold">
            {ariaLabel}
          </h2>
          <p
            className="text-xs"
            style={{ color: 'var(--ucl-muted-foreground, inherit)' }}
          >
            Mode: {viewMode === 'plain' ? 'Plain English' : 'Developer'} ·
            Snapshot {graph.snapshotId.slice(0, 8)}
          </p>
        </div>
        {activeZoomNodeId ? (
          <button
            type="button"
            onClick={() => onNodeSelect(activeZoomNodeId)}
            className="px-2 py-1 text-xs rounded border"
            style={{
              borderColor: 'var(--ucl-border, currentColor)',
              color: 'var(--ucl-foreground, inherit)',
            }}
          >
            Zoomed:{' '}
            {nodeById.get(activeZoomNodeId)?.plainTitle ?? activeZoomNodeId}
          </button>
        ) : null}
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Assigned Files"
          value={formatBpsPercent(graph.metrics.assignedFilesBps)}
          variant="success"
        />
        <KpiCard
          label="Edge Resolution"
          value={formatBpsPercent(graph.metrics.edgeResolutionCoverageBps)}
        />
        <KpiCard
          label="Unmatched Calls"
          value={graph.metrics.unmatchedFrontendCallsCount}
          variant={
            graph.metrics.unmatchedFrontendCallsCount > 0
              ? 'warning'
              : 'default'
          }
        />
        <KpiCard
          label="AI Labeling Cost"
          value={formatMicroUsd(graph.metrics.aiLabelingCostMicroUsd)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          className="rounded border p-3"
          style={{ borderColor: 'var(--ucl-border, currentColor)' }}
        >
          <h3 className="mb-2 text-sm font-medium">Topology Tree</h3>
          <TreeView
            nodes={treeNodes}
            onSelect={(treeNode) => handleInspectNode(treeNode.id)}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-2">
          <h3 className="text-sm font-medium">Nodes ({visibleNodes.length})</h3>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {visibleNodes.map((node) => {
              const title =
                viewMode === 'plain' ? node.plainTitle : node.technicalName;
              const isRecent = highlightRecentWork && node.changedInLastCommit;
              return (
                <li
                  key={node.id}
                  className="rounded border p-3 flex flex-col gap-2"
                  style={{
                    borderColor: isRecent
                      ? 'var(--ucl-primary, currentColor)'
                      : 'var(--ucl-border, currentColor)',
                    backgroundColor: 'var(--ucl-surface, transparent)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{title}</div>
                      <div
                        className="text-xs"
                        style={{
                          color: 'var(--ucl-muted-foreground, inherit)',
                        }}
                      >
                        {node.kind} · {node.repoId}
                      </div>
                    </div>
                    {isRecent ? (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--ucl-primary, currentColor)',
                          color: 'var(--ucl-primary-foreground, inherit)',
                        }}
                      >
                        Recent Commit
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs">{node.plainSummary}</p>
                  {isRecent && node.changeRationale ? (
                    <p className="text-xs italic">{node.changeRationale}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      aria-label={`Inspect ${node.plainTitle}`}
                      onClick={() => handleInspectNode(node.id)}
                      className="px-2 py-1 text-xs rounded border"
                      style={{ borderColor: 'var(--ucl-border, currentColor)' }}
                    >
                      Inspect
                    </button>
                    {node.kind === 'screen' && onScreenTraceRequest ? (
                      <button
                        type="button"
                        aria-label={`Trace Screen-to-DB for ${node.plainTitle}`}
                        onClick={() => onScreenTraceRequest(node.id)}
                        className="px-2 py-1 text-xs rounded border"
                        style={{
                          borderColor: 'var(--ucl-border, currentColor)',
                        }}
                      >
                        Trace Screen-to-DB
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Drawer
        open={Boolean(selectedNode)}
        onOpenChange={(open) => {
          if (!open) setSelectedNodeId(null);
        }}
        title={
          selectedNode
            ? viewMode === 'plain'
              ? selectedNode.plainTitle
              : selectedNode.technicalName
            : ''
        }
        description={selectedNode?.plainSummary}
      >
        {selectedNode ? (
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-semibold uppercase mb-1">
                Connected Edges ({selectedEdges.length})
              </h4>
              <Timeline
                items={selectedEdges.map((e) => ({
                  id: e.id,
                  title: `${e.kind}${e.isCrossRepo ? ' (Cross-Repo)' : ''}`,
                  description: `${e.sourceNodeId} → ${e.targetNodeId}`,
                  timestamp: `Confidence ${formatBpsPercent(e.confidenceBps)}`,
                }))}
              />
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase mb-1">
                UDPA Findings ({selectedFindings.length})
              </h4>
              {selectedFindings.length === 0 ? (
                <p className="text-xs">
                  No security or hygiene findings on this node.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {selectedFindings.map((f) => (
                    <li
                      key={f.fingerprint}
                      className="rounded border p-2 text-xs"
                      style={{ borderColor: 'var(--ucl-border, currentColor)' }}
                    >
                      <div className="font-semibold">{f.ruleId}</div>
                      <div>
                        {f.udpaAxis} · {f.severity} · {f.filePath}:{f.line}
                      </div>
                      <p>{f.remediationPrompt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </section>
  );
}
