import { describe, expect, it } from 'vitest';
import {
  getMemberPresenceSummary,
  getPendingMemberAction,
  getPublishGuardReason,
  getPublishStateGuidance,
  getPublishStateSummary,
} from './builderLifecycle';

describe('builderLifecycle', () => {
  const editorContext = {
    project: {
      id: 'project-1',
      name: 'Project 1',
      pages: [],
      members: [],
      publish: {
        status: 'draft' as const,
        publishedAt: null,
        publishedBy: null,
        sourceVersionId: null,
      },
    },
    page: {},
  };

  it('summarizes publish guard reasons', () => {
    expect(
      getPublishGuardReason({
        editorContext: null,
        versionsCount: 1,
        canManageLifecycle: true,
      })
    ).toBe('Open a project page before publishing.');
    expect(
      getPublishGuardReason({
        editorContext,
        versionsCount: 0,
        canManageLifecycle: true,
      })
    ).toBe('Save at least one version before publishing.');
  });

  it('builds publish state guidance and summary', () => {
    expect(
      getPublishStateSummary({ editorContext: null, latestVersion: null })
    ).toBe('Open a project page to review release readiness.');
    expect(
      getPublishStateGuidance({
        editorContext,
        canManageLifecycle: true,
        publishGuardReason: null,
      })
    ).toContain(
      'Release checks passed. Publishing will stamp the current saved version onto the project.'
    );
  });

  it('summarizes member presence and pending actions', () => {
    expect(getMemberPresenceSummary([])).toBe(
      'No recent collaborator activity yet'
    );
    expect(
      getPendingMemberAction('add', { email: 'a@b.dev', role: 'viewer' })
    ).toEqual({ type: 'add', email: 'a@b.dev', role: 'viewer' });
  });
});
