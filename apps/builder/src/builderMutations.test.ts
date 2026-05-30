import { describe, expect, it } from 'vitest';
import {
  buildMemberActivityNotice,
  buildVersionRecord,
  createCommentId,
  createVersionId,
  formatRepositoryActionNotice,
  updateProjectPublish,
} from './builderMutations';
import type { BuilderProject } from './types';

describe('builderMutations', () => {
  it('creates stable mutation payloads', () => {
    expect(createVersionId()).toContain('version-');
    expect(createCommentId()).toContain('comment-');
    expect(
      buildVersionRecord({
        pageId: 'page-1',
        label: 'Version 1',
        snapshot: { id: 'root' } as never,
        authorId: 'user-1',
      }).label
    ).toBe('Version 1');
  });

  it('updates publish and builds notices', () => {
    const projects = [
      {
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
    ] as BuilderProject[];
    expect(
      updateProjectPublish(projects, 'project-1', projects[0].publish)
    ).toEqual(projects);
    expect(formatRepositoryActionNotice('Saved.')).toContain('Saved.');
    expect(
      buildMemberActivityNotice(
        { email: 'a@b.dev', role: 'viewer' } as never,
        'add'
      )
    ).toContain('Added a@b.dev as viewer.');
  });
});
