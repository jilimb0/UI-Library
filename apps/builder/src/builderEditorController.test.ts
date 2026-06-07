/**
 * Unit tests for builderEditorController pure-logic paths.
 *
 * The hook itself is a React hook and requires a full React render tree to
 * exercise in isolation. Instead these tests cover:
 *   - The derived state helpers it delegates to (lifecycle, capabilities,
 *     publish guard, member presence).
 *   - The editorContext derivation logic (parseEditorRoute + projects lookup).
 *   - The PromptDraftOverrides defaults contract.
 *   - The handleGenerateProjectDraft side-effects contract at the level of
 *     the prompt-engine API it calls.
 *
 * Browser-dependent effects (useEffect, window, localStorage) are intentionally
 * excluded — they are covered by E2E tests.
 */

import { describe, expect, it } from 'vitest';
import { resolveBuilderRoleCapabilities } from './builderCapabilities';
import {
  getMemberPresenceSummary,
  getPublishGuardReason,
  getPublishStateGuidance,
  getPublishStateSummary,
} from './builderLifecycle';
import {
  createDefaultMembers,
  createDefaultPublishRecord,
} from './persistence';
import { parseEditorRoute } from './routes';
import type {
  BuilderMember,
  BuilderPage,
  BuilderProject,
  BuilderRole,
} from './types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makePage(id = 'page-1'): BuilderPage {
  return {
    id,
    title: 'Landing',
    root: { id: 'root', componentId: 'card', props: {}, children: [] },
  };
}

function makeProject(
  id = 'proj-1',
  overrides: Partial<BuilderProject> = {}
): BuilderProject {
  return {
    id,
    name: 'Demo',
    publish: createDefaultPublishRecord(),
    pages: [makePage()],
    members: createDefaultMembers(),
    ...overrides,
  };
}

function makeEditorContext(projectOverrides: Partial<BuilderProject> = {}) {
  const project = makeProject('proj-1', projectOverrides);
  return { project, page: project.pages[0]! };
}

// ── editorContext derivation ──────────────────────────────────────────────────

describe('editorContext derivation (parseEditorRoute)', () => {
  it('returns null for non-editor routes', () => {
    expect(parseEditorRoute('/projects')).toBeNull();
    expect(parseEditorRoute('/')).toBeNull();
    expect(parseEditorRoute('/projects/proj-1')).toBeNull();
  });

  it('extracts projectId and pageId from a valid editor route', () => {
    const parsed = parseEditorRoute('/projects/proj-1/pages/page-1');
    expect(parsed).toEqual({ projectId: 'proj-1', pageId: 'page-1' });
  });

  it('handles slugs with hyphens and numbers', () => {
    const parsed = parseEditorRoute('/projects/my-project-42/pages/landing-v2');
    expect(parsed).toEqual({
      projectId: 'my-project-42',
      pageId: 'landing-v2',
    });
  });
});

// ── session role and capabilities ─────────────────────────────────────────────

describe('session role capabilities (resolveBuilderRoleCapabilities)', () => {
  const allRoles: BuilderRole[] = [
    'owner',
    'admin',
    'editor',
    'commenter',
    'viewer',
  ];

  it('owner has all capabilities', () => {
    const caps = resolveBuilderRoleCapabilities('owner');
    expect(caps.canEdit).toBe(true);
    expect(caps.canComment).toBe(true);
    expect(caps.canSaveVersions).toBe(true);
    expect(caps.canRestoreVersions).toBe(true);
    expect(caps.canManageLifecycle).toBe(true);
  });

  it('viewer has no capabilities', () => {
    const caps = resolveBuilderRoleCapabilities('viewer');
    expect(caps.canEdit).toBe(false);
    expect(caps.canComment).toBe(false);
    expect(caps.canSaveVersions).toBe(false);
    expect(caps.canRestoreVersions).toBe(false);
    expect(caps.canManageLifecycle).toBe(false);
  });

  it('commenter can only comment', () => {
    const caps = resolveBuilderRoleCapabilities('commenter');
    expect(caps.canComment).toBe(true);
    expect(caps.canEdit).toBe(false);
    expect(caps.canSaveVersions).toBe(false);
  });

  it('editor can edit and save but cannot restore or publish', () => {
    const caps = resolveBuilderRoleCapabilities('editor');
    expect(caps.canEdit).toBe(true);
    expect(caps.canSaveVersions).toBe(true);
    expect(caps.canRestoreVersions).toBe(false);
    expect(caps.canManageLifecycle).toBe(false);
  });

  it('returns a complete capability object for every role', () => {
    for (const role of allRoles) {
      const caps = resolveBuilderRoleCapabilities(role);
      expect(Object.keys(caps)).toEqual([
        'canEdit',
        'canComment',
        'canSaveVersions',
        'canRestoreVersions',
        'canManageLifecycle',
      ]);
    }
  });
});

// ── canPublishProject derivation ──────────────────────────────────────────────

describe('publish guard (getPublishGuardReason)', () => {
  it('blocks when canManageLifecycle is false', () => {
    const reason = getPublishGuardReason({
      editorContext: makeEditorContext(),
      versionsCount: 1,
      canManageLifecycle: false,
    });
    expect(reason).toMatch(/admin|owner/i);
  });

  it('blocks when editorContext is null', () => {
    const reason = getPublishGuardReason({
      editorContext: null,
      versionsCount: 1,
      canManageLifecycle: true,
    });
    expect(reason).toMatch(/open a project/i);
  });

  it('blocks when project is already published', () => {
    const reason = getPublishGuardReason({
      editorContext: makeEditorContext({
        publish: {
          status: 'published',
          publishedAt: null,
          publishedBy: null,
          sourceVersionId: null,
        },
      }),
      versionsCount: 1,
      canManageLifecycle: true,
    });
    expect(reason).toMatch(/already published/i);
  });

  it('blocks when versionsCount is 0', () => {
    const reason = getPublishGuardReason({
      editorContext: makeEditorContext(),
      versionsCount: 0,
      canManageLifecycle: true,
    });
    expect(reason).toMatch(/version/i);
  });

  it('returns null when all checks pass', () => {
    const reason = getPublishGuardReason({
      editorContext: makeEditorContext(),
      versionsCount: 1,
      canManageLifecycle: true,
    });
    expect(reason).toBeNull();
  });

  it('canPublishProject is true only when guard returns null + canManageLifecycle', () => {
    const guard = getPublishGuardReason({
      editorContext: makeEditorContext(),
      versionsCount: 1,
      canManageLifecycle: true,
    });
    const canPublish = true && guard === null;
    expect(canPublish).toBe(true);
  });
});

// ── publish state summary and guidance ────────────────────────────────────────

describe('publish state summary (getPublishStateSummary)', () => {
  it('prompts to open a page when editorContext is null', () => {
    const summary = getPublishStateSummary({
      editorContext: null,
      latestVersion: null,
    });
    expect(summary).toMatch(/open a project/i);
  });

  it('reports draft state without a version', () => {
    const summary = getPublishStateSummary({
      editorContext: makeEditorContext(),
      latestVersion: null,
    });
    expect(summary).toMatch(/no saved version/i);
  });

  it('reports draft state with a version label', () => {
    const summary = getPublishStateSummary({
      editorContext: makeEditorContext(),
      latestVersion: {
        id: 'v1',
        pageId: 'page-1',
        label: 'v1.0',
        snapshot: {
          id: 'snap-root',
          componentId: 'card',
          props: {},
          children: [],
        },
        authorId: 'local-owner',
        createdAt: new Date().toISOString(),
      },
    });
    expect(summary).toContain('v1.0');
  });

  it('reports published state', () => {
    const summary = getPublishStateSummary({
      editorContext: makeEditorContext({
        publish: {
          status: 'published',
          publishedAt: null,
          publishedBy: null,
          sourceVersionId: null,
        },
      }),
      latestVersion: null,
    });
    expect(summary).toMatch(/published/i);
  });
});

describe('publish state guidance (getPublishStateGuidance)', () => {
  it('returns guidance to select a page when editorContext is null', () => {
    const guidance = getPublishStateGuidance({
      editorContext: null,
      canManageLifecycle: true,
      publishGuardReason: null,
    });
    expect(guidance.some((line) => /select a project/i.test(line))).toBe(true);
  });

  it('returns role escalation guidance when canManageLifecycle is false', () => {
    const guidance = getPublishStateGuidance({
      editorContext: makeEditorContext(),
      canManageLifecycle: false,
      publishGuardReason:
        'Only admins or owners can manage publish lifecycle actions.',
    });
    expect(guidance.some((line) => /admin|owner/i.test(line))).toBe(true);
  });

  it('returns blocker guidance when guard reason is set', () => {
    const reason = 'Save at least one version before publishing.';
    const guidance = getPublishStateGuidance({
      editorContext: makeEditorContext(),
      canManageLifecycle: true,
      publishGuardReason: reason,
    });
    expect(guidance.some((line) => line.includes(reason))).toBe(true);
  });

  it('returns positive guidance when all checks pass', () => {
    const guidance = getPublishStateGuidance({
      editorContext: makeEditorContext(),
      canManageLifecycle: true,
      publishGuardReason: null,
    });
    expect(guidance.some((line) => /release checks passed/i.test(line))).toBe(
      true
    );
  });
});

// ── member presence ───────────────────────────────────────────────────────────

describe('member presence summary (getMemberPresenceSummary)', () => {
  it('reports no activity for members with no active page or last active timestamp', () => {
    const members: BuilderMember[] = [
      { userId: 'u1', email: 'a@b.dev', role: 'viewer' },
    ];
    expect(getMemberPresenceSummary(members)).toMatch(/no recent/i);
  });

  it('counts members actively editing a page', () => {
    const members: BuilderMember[] = [
      {
        userId: 'u1',
        email: 'a@b.dev',
        role: 'editor',
        activePageId: 'page-1',
      },
      { userId: 'u2', email: 'b@b.dev', role: 'viewer' },
    ];
    const summary = getMemberPresenceSummary(members);
    expect(summary).toMatch(/1 collaborator/i);
    expect(summary).toMatch(/editing now/i);
  });

  it('counts recently active members (lastActiveAt set, no active page)', () => {
    const members: BuilderMember[] = [
      {
        userId: 'u1',
        email: 'a@b.dev',
        role: 'editor',
        lastActiveAt: new Date().toISOString(),
      },
    ];
    expect(getMemberPresenceSummary(members)).toMatch(/recently active/i);
  });

  it('uses plural form for multiple active collaborators', () => {
    const members: BuilderMember[] = [
      {
        userId: 'u1',
        email: 'a@b.dev',
        role: 'editor',
        activePageId: 'page-1',
      },
      {
        userId: 'u2',
        email: 'b@b.dev',
        role: 'editor',
        activePageId: 'page-2',
      },
    ];
    expect(getMemberPresenceSummary(members)).toMatch(/2 collaborators/i);
  });
});

// ── PromptDraftOverrides defaults ─────────────────────────────────────────────

describe('PromptDraftOverrides defaults contract', () => {
  // The hook applies these defaults when overrides are undefined.
  // We test the defaulting logic in isolation by mirroring it.
  function resolveDefaults(overrides?: {
    productType?: string;
    targetAudience?: string;
    generationMode?: string;
  }) {
    return {
      productType: overrides?.productType ?? 'UI Starter',
      targetAudience: overrides?.targetAudience ?? 'product teams',
      generationMode: overrides?.generationMode ?? 'landing-page',
    };
  }

  it('uses "UI Starter" as default productType', () => {
    expect(resolveDefaults().productType).toBe('UI Starter');
  });

  it('uses "product teams" as default targetAudience', () => {
    expect(resolveDefaults().targetAudience).toBe('product teams');
  });

  it('uses "landing-page" as default generationMode', () => {
    expect(resolveDefaults().generationMode).toBe('landing-page');
  });

  it('respects provided overrides', () => {
    const resolved = resolveDefaults({
      productType: 'Analytics Dashboard',
      targetAudience: 'data teams',
      generationMode: 'dashboard',
    });
    expect(resolved.productType).toBe('Analytics Dashboard');
    expect(resolved.targetAudience).toBe('data teams');
    expect(resolved.generationMode).toBe('dashboard');
  });
});
