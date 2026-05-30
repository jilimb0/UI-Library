import type { PromptTemplate } from './promptModel';

export type GenerationSummary = {
  id: string;
  createdAt: string;
  templateId: PromptTemplate['id'];
  templateLabel: string;
  audience: string;
  prompt: string;
  assumptions: string[];
  unsupportedIntent: string | null;
  fallbackDecisions: string[];
  policyScore: number;
  policyStatus: 'allow' | 'warn' | 'block';
  policyReasons: string[];
  compositionFamily?: string;
  layoutRhythm?: string;
  protectedNodeIds?: string[];
  sectionDecisions?: Record<string, 'pending' | 'accepted' | 'rejected'>;
  diffSummary?: {
    addedSections: string[];
    removedSections: string[];
    persistedSections: string[];
  } | null;
  linkedVersionId?: string | null;
  linkedVersionLabel?: string | null;
  linkedVersionCreatedAt?: string | null;
  linkedSnapshotId?: string | null;
  snapshotLabel?: string | null;
};

export function createBlockedGenerationSummary(
  summary: GenerationSummary,
  protectedNodeIds: string[],
  pendingDiffSummary: GenerationSummary['diffSummary']
): GenerationSummary {
  return {
    ...summary,
    compositionFamily: undefined,
    layoutRhythm: undefined,
    sectionDecisions: {},
    protectedNodeIds,
    diffSummary: pendingDiffSummary,
    linkedVersionId: null,
    linkedVersionLabel: null,
    linkedVersionCreatedAt: null,
    linkedSnapshotId: null,
    snapshotLabel: null,
  };
}

export function mergeSectionDecision(
  summary: GenerationSummary | null,
  nodeId: string,
  decision: 'pending' | 'accepted' | 'rejected'
): GenerationSummary | null {
  if (!summary) return summary;
  return {
    ...summary,
    sectionDecisions: {
      ...(summary.sectionDecisions ?? {}),
      [nodeId]: decision,
    },
  };
}

export function mergeProtectedNodeId(
  summary: GenerationSummary | null,
  nodeId: string
): GenerationSummary | null {
  if (!summary) return summary;
  return {
    ...summary,
    protectedNodeIds: summary.protectedNodeIds?.includes(nodeId)
      ? summary.protectedNodeIds.filter((id) => id !== nodeId)
      : [...(summary.protectedNodeIds ?? []), nodeId],
  };
}

export function applyPromptVersionLink(
  summary: GenerationSummary | null,
  version: {
    id: string;
    label: string;
    createdAt: string;
    snapshot?: { id?: string } | undefined;
  }
): GenerationSummary | null {
  if (!summary) return summary;
  return {
    ...summary,
    linkedVersionId: version.id,
    linkedVersionLabel: version.label,
    linkedVersionCreatedAt: version.createdAt,
    linkedSnapshotId: version.snapshot?.id ?? null,
    snapshotLabel: version.snapshot?.id
      ? `Snapshot ${version.snapshot.id}`
      : null,
  };
}

export function refreshSectionDecisionsFromReviewState(
  current: GenerationSummary | null,
  reviewStates: Array<{ id: string; reviewState?: unknown }>
): GenerationSummary | null {
  if (!current) return current;
  const existing = current.sectionDecisions ?? {};
  const next = { ...existing };
  let changed = false;

  for (const section of reviewStates) {
    const reviewState = section.reviewState;
    if (
      reviewState === 'pending' ||
      reviewState === 'accepted' ||
      reviewState === 'rejected'
    ) {
      if (next[section.id] !== reviewState) {
        next[section.id] = reviewState;
        changed = true;
      }
    }
  }

  return changed ? { ...current, sectionDecisions: next } : current;
}
