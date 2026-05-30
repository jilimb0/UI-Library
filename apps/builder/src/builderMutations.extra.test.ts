import { describe, expect, it } from 'vitest';
import {
  buildCommentRecord,
  buildMemberEventNote,
  buildPublishEventNote,
  buildPublishRecord,
  createGovernanceEventId,
} from './builderMutations';

describe('builderMutations extra helpers', () => {
  it('builds governance event ids and notes', () => {
    expect(createGovernanceEventId()).toContain('event-');
    expect(
      buildPublishEventNote(
        {
          status: 'published',
          publishedAt: null,
          publishedBy: null,
          sourceVersionId: 'version-1',
        },
        'Version 1',
        'published'
      )
    ).toContain('Published from version version-1');
    expect(
      buildMemberEventNote(
        { email: 'a@b.dev', role: 'viewer' } as never,
        'removed'
      )
    ).toContain('Removed member a@b.dev');
    expect(
      buildCommentRecord({
        pageId: 'page-1',
        nodeId: null,
        body: 'Hello',
        authorId: 'user-1',
      }).body
    ).toBe('Hello');
    expect(
      buildPublishRecord({
        status: 'draft',
        publishedBy: null,
        sourceVersionId: null,
      }).status
    ).toBe('draft');
  });
});
