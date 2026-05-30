import { describe, expect, it } from 'vitest';
import {
  applyPromptVersionLink,
  createBlockedGenerationSummary,
  type GenerationSummary,
  mergeProtectedNodeId,
  mergeSectionDecision,
  refreshSectionDecisionsFromReviewState,
} from './generationState';

const baseSummary: GenerationSummary = {
  id: 'gen-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  templateId: 'landing-page' as const,
  templateLabel: 'Landing page',
  audience: 'teams',
  prompt: 'Build a page',
  assumptions: [],
  unsupportedIntent: null,
  fallbackDecisions: [],
  policyScore: 10,
  policyStatus: 'allow' as const,
  policyReasons: [],
};

describe('generationState', () => {
  it('creates a blocked summary with reset linkage fields', () => {
    const result = createBlockedGenerationSummary(baseSummary, ['node-1'], {
      addedSections: ['a'],
      removedSections: [],
      persistedSections: [],
    });

    expect(result.compositionFamily).toBeUndefined();
    expect(result.layoutRhythm).toBeUndefined();
    expect(result.sectionDecisions).toEqual({});
    expect(result.protectedNodeIds).toEqual(['node-1']);
    expect(result.linkedVersionId).toBeNull();
    expect(result.snapshotLabel).toBeNull();
  });

  it('merges section decisions immutably', () => {
    const result = mergeSectionDecision(baseSummary, 'section-1', 'accepted');

    expect(result?.sectionDecisions).toEqual({ 'section-1': 'accepted' });
    expect(baseSummary.sectionDecisions).toBeUndefined();
  });

  it('toggles protected node ids immutably', () => {
    const first = mergeProtectedNodeId(baseSummary, 'node-1');
    const second = mergeProtectedNodeId(first, 'node-1');

    expect(first?.protectedNodeIds).toEqual(['node-1']);
    expect(second?.protectedNodeIds).toEqual([]);
  });

  it('applies prompt version linkage metadata', () => {
    const result = applyPromptVersionLink(baseSummary, {
      id: 'version-1',
      label: '[Prompt] v1',
      createdAt: '2026-01-02T00:00:00.000Z',
      snapshot: { id: 'snapshot-1' },
    });

    expect(result?.linkedVersionId).toBe('version-1');
    expect(result?.linkedSnapshotId).toBe('snapshot-1');
    expect(result?.snapshotLabel).toBe('Snapshot snapshot-1');
  });

  it('refreshes section decisions from review state', () => {
    const result = refreshSectionDecisionsFromReviewState(baseSummary, [
      { id: 'section-1', reviewState: 'accepted' },
      { id: 'section-2', reviewState: 'ignored' },
    ]);

    expect(result?.sectionDecisions).toEqual({ 'section-1': 'accepted' });
  });
});
