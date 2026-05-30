import { getSupabaseConnectionStatus } from './supabaseClient';
import type {
  BuilderMember,
  BuilderProject,
  PageVersion,
  PublishRecord,
} from './types';

export function createVersionId() {
  return `version-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createCommentId() {
  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function updateProjectPublish(
  projects: BuilderProject[],
  projectId: string,
  publish: PublishRecord
): BuilderProject[] {
  return projects.map((project) =>
    project.id === projectId ? { ...project, publish } : project
  );
}

export function formatRepositoryActionNotice(base: string) {
  const status = getSupabaseConnectionStatus();
  if (status.mode === 'configured') return `${base} ${status.summary}`;
  if (status.mode === 'partial') {
    return `${base} Remote repository setup is incomplete, so this result should not be treated as authoritative yet.`;
  }
  return `${base} This change is only stored in the local Supabase stub until remote credentials are configured.`;
}

export function buildVersionRecord({
  pageId,
  label,
  snapshot,
  authorId,
}: {
  pageId: string;
  label: string;
  snapshot: PageVersion['snapshot'];
  authorId: string;
}): PageVersion {
  return {
    id: createVersionId(),
    pageId,
    label,
    snapshot: structuredClone(snapshot),
    authorId,
    createdAt: new Date().toISOString(),
  };
}

export function buildCommentRecord({
  pageId,
  nodeId,
  body,
  authorId,
}: {
  pageId: string;
  nodeId: string | null;
  body: string;
  authorId: string;
}) {
  return {
    id: createCommentId(),
    pageId,
    nodeId: nodeId ?? undefined,
    body,
    authorId,
    resolved: false,
    createdAt: new Date().toISOString(),
  };
}

export function buildPublishRecord(next: {
  status: 'draft' | 'published';
  publishedBy: string | null;
  sourceVersionId: string | null;
}): PublishRecord {
  return {
    status: next.status,
    publishedAt: next.status === 'published' ? new Date().toISOString() : null,
    publishedBy: next.publishedBy,
    sourceVersionId: next.sourceVersionId,
  };
}

export function buildMemberActivityNotice(
  member: BuilderMember,
  action: 'add' | 'update' | 'remove'
) {
  return `${action === 'add' ? 'Added' : action === 'update' ? 'Changed' : 'Removed'} ${member.email}${action === 'update' ? ` to ${member.role}` : action === 'add' ? ` as ${member.role}` : ''}.`;
}

export function createGovernanceEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildPublishEventNote(
  publish: PublishRecord,
  latestVersionLabel: string | null,
  verb: 'published' | 'unpublished'
) {
  if (verb === 'unpublished') return 'Returned project to draft';
  return publish.sourceVersionId
    ? `Published from version ${publish.sourceVersionId}`
    : latestVersionLabel
      ? `Published project from latest version ${latestVersionLabel}`
      : 'Published project';
}

export function buildMemberEventNote(
  member: BuilderMember,
  action: 'added' | 'updated' | 'removed',
  previousRole?: BuilderMember['role']
) {
  if (action === 'added')
    return `Added member ${member.email} as ${member.role}`;
  if (action === 'removed') return `Removed member ${member.email}`;
  return `Changed ${member.email} from ${previousRole ?? member.role} to ${member.role}`;
}
