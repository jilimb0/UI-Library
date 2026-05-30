import { foundationalComponents } from '@ui-construction-library/registry';
import {
  canComment as canCommentOnProject,
  canEditLayout,
  canManagePublishLifecycle,
  canRestoreVersion,
  canSaveVersion,
  createSessionFromMember,
} from './auth';
import type { BuilderPage, BuilderProject, BuilderRole } from './types';
import { collectValidationIssues } from './validation';

export type E2EGlobal = typeof globalThis & {
  __E2E_ROLE__?: BuilderRole;
};

export function getE2ERoleOverride(): BuilderRole | undefined {
  return (globalThis as E2EGlobal).__E2E_ROLE__;
}

export function canPublishCurrentProject({
  editorContext,
  versionsCount,
}: {
  editorContext: { project: BuilderProject; page: BuilderPage } | null;
  versionsCount: number;
}): string | null {
  if (!editorContext) return 'Open a project page before publishing.';
  if (editorContext.project.publish.status === 'published')
    return 'Project is already published.';
  if (versionsCount === 0)
    return 'Save at least one version before publishing.';

  const validationIssues = editorContext.project.pages.flatMap((page) =>
    collectValidationIssues(page.root, foundationalComponents)
  );
  const blockingIssues = validationIssues.filter(
    (issue) => issue.severity === 'error'
  );
  if (blockingIssues.length > 0) {
    const firstIssue = blockingIssues[0];
    return firstIssue
      ? `${firstIssue.message} (${blockingIssues.length} blocking issue${blockingIssues.length === 1 ? '' : 's'} total)`
      : 'Resolve required validation issues before publishing.';
  }
  return null;
}

export function markMemberActivity(
  projects: BuilderProject[],
  projectId: string,
  memberId: string,
  pageId: string | null
): BuilderProject[] {
  const timestamp = new Date().toISOString();

  return projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          members: project.members.map((member) =>
            member.userId === memberId
              ? {
                  ...member,
                  lastActiveAt: timestamp,
                  activePageId: pageId,
                }
              : member
          ),
        }
      : project
  );
}

export function createPageScaffold(pageId: string, title: string): BuilderPage {
  return {
    id: pageId,
    title,
    root: {
      id: `${pageId}-root`,
      componentId: 'card',
      props: {
        title,
        body: 'New page scaffold',
      },
      children: [],
    },
  };
}

export type BuilderRoleCapabilities = {
  canEdit: boolean;
  canComment: boolean;
  canSaveVersions: boolean;
  canRestoreVersions: boolean;
  canManageLifecycle: boolean;
};

export function resolveBuilderRoleCapabilities(
  role: BuilderRole
): BuilderRoleCapabilities {
  const session = createSessionFromMember({
    userId: `cap-${role}`,
    email: `${role}@builder.dev`,
    role,
  });
  return {
    canEdit: canEditLayout(session),
    canComment: canCommentOnProject(session),
    canSaveVersions: canSaveVersion(session),
    canRestoreVersions: canRestoreVersion(session),
    canManageLifecycle: canManagePublishLifecycle(session),
  };
}
