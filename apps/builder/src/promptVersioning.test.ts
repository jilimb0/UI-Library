import { describe, expect, it } from 'vitest';
import {
  createPromptLinkedVersion,
  linkGenerationToVersion,
} from './promptVersioning';

describe('promptVersioning', () => {
  const page = {
    id: 'page-1',
    title: 'Page 1',
    root: { id: 'root', componentId: 'stack', props: {}, children: [] },
  };

  it('creates prompt-linked version metadata', () => {
    const version = createPromptLinkedVersion(
      {
        id: 'gen-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        templateId: 'landing-page',
        templateLabel: 'Landing page',
        audience: 'product teams',
        prompt: 'Build a landing page',
        assumptions: [],
        unsupportedIntent: null,
        fallbackDecisions: [],
        policyScore: 1,
        policyStatus: 'allow',
        policyReasons: [],
        diffSummary: null,
      },
      page
    );

    expect(version.pageId).toBe('page-1');
    expect(version.label).toBe('[Prompt] Landing page');
    expect(version.snapshot.promptGenerationId).toBe('gen-1');
  });

  it('links generation summary to version metadata', () => {
    expect(
      linkGenerationToVersion(
        {
          id: 'version-1',
          label: '[Prompt] Landing page',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        'snapshot-1'
      )
    ).toEqual({
      linkedVersionId: 'version-1',
      linkedVersionLabel: '[Prompt] Landing page',
      linkedVersionCreatedAt: '2024-01-01T00:00:00.000Z',
      linkedSnapshotId: 'snapshot-1',
      snapshotLabel: 'Snapshot snapshot-1',
    });
  });
});
