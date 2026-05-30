import { describe, expect, it } from 'vitest';
import {
  canPublishCurrentProject,
  createPageScaffold,
  resolveBuilderRoleCapabilities,
} from './builderControllers';
import {
  createDefaultMembers,
  createDefaultPublishRecord,
} from './persistence';
import type { BuilderProject, BuilderRole } from './types';

function makeProject(overrides?: Partial<BuilderProject>): BuilderProject {
  return {
    id: 'project-1',
    name: 'Demo',
    publish: createDefaultPublishRecord(),
    pages: [createPageScaffold('landing', 'Landing')],
    members: createDefaultMembers(),
    ...overrides,
  };
}

function getCaps(role: BuilderRole) {
  return resolveBuilderRoleCapabilities(role);
}

describe('publish guards', () => {
  it('requires at least one saved version before publishing', () => {
    const project = makeProject();
    const reason = canPublishCurrentProject({
      editorContext: { project, page: project.pages[0] },
      versionsCount: 0,
    });
    expect(reason).toMatch(/save at least one version/i);
  });

  it('blocks publishing when the page tree has validation errors', () => {
    const project = makeProject({
      pages: [
        {
          id: 'landing',
          title: 'Landing',
          root: {
            id: 'root',
            componentId: 'calendar',
            props: {},
            children: [
              { id: 'child', componentId: 'button', props: {}, children: [] },
            ],
          },
        },
      ],
    });
    const reason = canPublishCurrentProject({
      editorContext: { project, page: project.pages[0] },
      versionsCount: 1,
    });
    expect(reason).toMatch(/should not contain child nodes/i);
  });

  it('allows publishing after versioning when page tree is valid', () => {
    const project = makeProject({
      pages: [
        {
          id: 'landing',
          title: 'Landing',
          root: {
            id: 'root',
            componentId: 'card',
            props: { title: 'Ready', body: 'Body' },
            children: [],
          },
        },
      ],
    });
    const reason = canPublishCurrentProject({
      editorContext: { project, page: project.pages[0] },
      versionsCount: 1,
    });
    expect(reason).toBeNull();
  });
});

describe('builder role capability matrix', () => {
  it('owner has full builder governance capabilities', () => {
    expect(getCaps('owner')).toEqual({
      canEdit: true,
      canComment: true,
      canSaveVersions: true,
      canRestoreVersions: true,
      canManageLifecycle: true,
    });
  });

  it('admin matches owner governance capabilities', () => {
    expect(getCaps('admin')).toEqual({
      canEdit: true,
      canComment: true,
      canSaveVersions: true,
      canRestoreVersions: true,
      canManageLifecycle: true,
    });
  });

  it('editor can edit and save versions but cannot restore or publish', () => {
    expect(getCaps('editor')).toEqual({
      canEdit: true,
      canComment: true,
      canSaveVersions: true,
      canRestoreVersions: false,
      canManageLifecycle: false,
    });
  });

  it('commenter can only comment', () => {
    expect(getCaps('commenter')).toEqual({
      canEdit: false,
      canComment: true,
      canSaveVersions: false,
      canRestoreVersions: false,
      canManageLifecycle: false,
    });
  });

  it('viewer has read-only access', () => {
    expect(getCaps('viewer')).toEqual({
      canEdit: false,
      canComment: false,
      canSaveVersions: false,
      canRestoreVersions: false,
      canManageLifecycle: false,
    });
  });
});
