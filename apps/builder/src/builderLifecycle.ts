import type {
  BuilderMember,
  BuilderProject,
  BuilderRole,
  PageVersion,
} from './types';

export function getPublishGuardReason({
  editorContext,
  versionsCount,
  canManageLifecycle,
}: {
  editorContext: { project: BuilderProject; page: unknown } | null;
  versionsCount: number;
  canManageLifecycle: boolean;
}): string | null {
  if (!canManageLifecycle) {
    return 'Only admins or owners can manage publish lifecycle actions.';
  }
  if (!editorContext) return 'Open a project page before publishing.';
  if (editorContext.project.publish.status === 'published')
    return 'Project is already published.';
  if (versionsCount === 0)
    return 'Save at least one version before publishing.';
  return null;
}

export function getPublishStateSummary({
  editorContext,
  latestVersion,
}: {
  editorContext: { project: BuilderProject; page: unknown } | null;
  latestVersion: PageVersion | null;
}): string {
  if (!editorContext) {
    return 'Open a project page to review release readiness.';
  }
  if (editorContext.project.publish.status === 'published') {
    return latestVersion
      ? `Published from version ${latestVersion.label}.`
      : 'Project is published and can be returned to draft if more edits are needed.';
  }
  return latestVersion
    ? `Latest saved version: ${latestVersion.label}.`
    : 'No saved version yet. Create a version before publishing.';
}

export function getPublishStateGuidance({
  editorContext,
  canManageLifecycle,
  publishGuardReason,
}: {
  editorContext: { project: BuilderProject; page: unknown } | null;
  canManageLifecycle: boolean;
  publishGuardReason: string | null;
}): string[] {
  if (!editorContext) {
    return ['Select a project page to unlock publish lifecycle actions.'];
  }
  if (!canManageLifecycle) {
    return [
      'Publishing is restricted to admins and owners in this workspace.',
      'Ask a project owner to publish or change your role if you need release access.',
    ];
  }
  if (editorContext.project.publish.status === 'published') {
    return [
      'Use unpublish to return the project to draft before making another release pass.',
      'Review publish history to confirm who shipped the current state and from which version.',
    ];
  }
  if (publishGuardReason) {
    return [
      `Blocked: ${publishGuardReason}`,
      'Resolve the release blocker above, then try publishing again.',
    ];
  }
  return [
    'Release checks passed. Publishing will stamp the current saved version onto the project.',
    'Use the publish history panel to verify the event after release.',
  ];
}

export function getMemberPresenceSummary(members: BuilderMember[]): string {
  const activeEditors = members.filter((member) => member.activePageId);
  const recentlyActiveMembers = members.filter(
    (member) => !member.activePageId && member.lastActiveAt
  );
  return activeEditors.length
    ? `${activeEditors.length} collaborator${activeEditors.length === 1 ? '' : 's'} editing now · ${recentlyActiveMembers.length} recently active`
    : recentlyActiveMembers.length
      ? `${recentlyActiveMembers.length} collaborator${recentlyActiveMembers.length === 1 ? '' : 's'} recently active`
      : 'No recent collaborator activity yet';
}

export function getPendingMemberAction(
  type: 'add' | 'update' | 'remove',
  details: {
    memberId?: string;
    email?: string;
    role?: BuilderRole;
  }
): {
  type: 'add' | 'update' | 'remove';
  memberId?: string;
  email?: string;
  role?: BuilderRole;
} {
  return { type, ...details };
}
