import type {
  BuilderMember,
  BuilderRole,
  GovernanceEventKind,
  PublishEventRecord,
} from './types';

function createEventId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createGovernanceEvent({
  projectId,
  actorId,
  kind,
  member,
  nextRole,
}: {
  projectId: string;
  actorId: string;
  kind: GovernanceEventKind;
  member: Pick<BuilderMember, 'userId' | 'email' | 'role'>;
  nextRole?: BuilderRole;
}): PublishEventRecord {
  return {
    id: createEventId('publish-event'),
    projectId,
    pageId: null,
    type: kind,
    actorId,
    createdAt: new Date().toISOString(),
    sourceVersionId: null,
    note:
      kind === 'member-added'
        ? `Added ${member.email}.`
        : kind === 'member-role-updated'
          ? `Changed ${member.email} role from ${member.role} to ${nextRole}.`
          : `Removed ${member.email}.`,
    payload: {
      kind,
      memberId: member.userId,
      memberEmail: member.email,
      fromRole: member.role,
      toRole: nextRole,
    },
  };
}
