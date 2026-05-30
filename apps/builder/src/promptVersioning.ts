import type { PromptTemplate } from './promptModel';
import type { BuilderPage } from './types';

export type PromptGenerationSummary = {
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
  diffSummary?: {
    addedSections: string[];
    removedSections: string[];
    persistedSections: string[];
  } | null;
  protectedNodeIds?: string[];
  sectionDecisions?: Record<string, 'pending' | 'accepted' | 'rejected'>;
  compositionFamily?: string;
  layoutRhythm?: string;
  linkedVersionId?: string | null;
  linkedVersionLabel?: string | null;
  linkedVersionCreatedAt?: string | null;
  linkedSnapshotId?: string | null;
  snapshotLabel?: string | null;
};

export type PromptLinkedVersion = {
  id: string;
  pageId: string;
  label: string;
  authorId: string;
  createdAt: string;
  snapshot: {
    id: string;
    promptGenerationId: string;
    prompt: string;
    audience: string;
    templateId: string;
    diffSummary: PromptGenerationSummary['diffSummary'];
    protectedNodeIds: string[];
    sectionDecisions: Record<string, 'pending' | 'accepted' | 'rejected'>;
    page: BuilderPage;
  };
};

export function createPromptLinkedVersion(
  summary: PromptGenerationSummary,
  page: BuilderPage
): PromptLinkedVersion {
  const snapshotId = `snapshot-${Date.now()}`;
  const versionId = `version-${Date.now()}`;

  return {
    id: versionId,
    pageId: page.id,
    label: `[Prompt] ${summary.templateLabel}`,
    snapshot: {
      id: snapshotId,
      promptGenerationId: summary.id,
      prompt: summary.prompt,
      audience: summary.audience,
      templateId: summary.templateId,
      diffSummary: summary.diffSummary ?? null,
      protectedNodeIds: summary.protectedNodeIds ?? [],
      sectionDecisions: summary.sectionDecisions ?? {},
      page,
    },
    authorId: 'system',
    createdAt: new Date().toISOString(),
  };
}

export function linkGenerationToVersion(
  version: Pick<PromptLinkedVersion, 'id' | 'label' | 'createdAt'>,
  snapshotId?: string | null
) {
  return {
    linkedVersionId: version.id,
    linkedVersionLabel: version.label,
    linkedVersionCreatedAt: version.createdAt,
    linkedSnapshotId: snapshotId ?? null,
    snapshotLabel: snapshotId ? `Snapshot ${snapshotId}` : null,
  };
}
