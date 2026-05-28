import type {
  BuilderMember,
  BuilderRole,
  RepositoryConnectivityStatus,
} from '../types';
import { PanelState } from './PanelState';

function formatPresenceLabel(member: BuilderMember) {
  if (member.activePageId) {
    return 'Editing now';
  }

  if (!member.lastActiveAt) {
    return 'No recent activity';
  }

  const elapsed = Date.now() - new Date(member.lastActiveAt).getTime();
  const minutes = Math.max(1, Math.round(elapsed / 60000));

  if (minutes <= 5) {
    return 'Active recently';
  }

  return `Active ${minutes}m ago`;
}

function formatPresenceDetail(member: BuilderMember) {
  if (member.activePageId) {
    return `Currently editing page ${member.activePageId}.`;
  }

  if (!member.lastActiveAt) {
    return 'This collaborator has not opened an editable surface in the current session yet.';
  }

  return `Last activity recorded at ${new Date(
    member.lastActiveAt
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}.`;
}

type Props = {
  members: BuilderMember[];
  activeMember?: BuilderMember | null;
  memberPresenceSummary?: string;
  canManageMembers: boolean;
  newMemberEmail: string;
  onNewMemberEmailChange: (value: string) => void;
  newMemberRole: BuilderRole;
  onNewMemberRoleChange: (role: BuilderRole) => void;
  acceptedInviteEmail: string;
  onAcceptedInviteEmailChange: (value: string) => void;
  onAddMember: () => void;
  onAcceptInvite: () => void;
  onUpdateMemberRole: (memberId: string, role: BuilderRole) => void;
  onRemoveMember: (memberId: string) => void;
  isLoading?: boolean;
  recoveryMessage?: string | null;
  onRecover?: () => void;
  repositoryStatusLabel?: string;
  repositoryStatusSummary?: string;
  repositoryStatusRecovery?: string | null;
  repositoryConnectivity?: RepositoryConnectivityStatus;
  pendingMemberAction?: null | {
    type: 'add' | 'update' | 'remove';
    memberId?: string;
    email?: string;
    role?: BuilderRole;
  };
};

const roles: BuilderRole[] = [
  'owner',
  'admin',
  'editor',
  'commenter',
  'viewer',
];

export function ProjectMembersPanel({
  members,
  activeMember = null,
  memberPresenceSummary,
  canManageMembers,
  newMemberEmail,
  onNewMemberEmailChange,
  newMemberRole,
  onNewMemberRoleChange,
  acceptedInviteEmail,
  onAcceptedInviteEmailChange,
  onAddMember,
  onAcceptInvite,
  onUpdateMemberRole,
  onRemoveMember,
  isLoading = false,
  recoveryMessage = null,
  onRecover,
  repositoryStatusLabel,
  repositoryStatusSummary,
  repositoryStatusRecovery = null,
  repositoryConnectivity,
  pendingMemberAction = null,
}: Props) {
  const managementBlockedByRepository =
    repositoryConnectivity?.mode === 'supabase' &&
    !repositoryConnectivity.allowsSafeRemoteActions;
  const effectiveCanManageMembers =
    canManageMembers && !managementBlockedByRepository;
  const isPendingCurrentAction = Boolean(pendingMemberAction);

  return (
    <section className="stack-panel">
      <div className="section-header">
        <div>
          <h3>Project members</h3>
          <p className="muted small">
            Manage collaboration roles for this project.
          </p>
          <p className="muted small">
            {memberPresenceSummary ?? 'No collaborator presence recorded yet.'}
          </p>
          {activeMember ? (
            <p className="muted small">
              Current session: {activeMember.email} ({activeMember.role})
            </p>
          ) : null}
        </div>
      </div>

      {repositoryStatusLabel ? (
        <PanelState
          title={`Repository state: ${repositoryStatusLabel}`}
          description={
            repositoryStatusSummary ?? 'Repository status is unavailable.'
          }
          tone={repositoryStatusRecovery ? 'recovery' : 'empty'}
        />
      ) : null}

      {repositoryStatusRecovery ? (
        <PanelState
          title="Collaboration confidence guidance"
          description={repositoryStatusRecovery}
          tone="recovery"
        />
      ) : null}

      {managementBlockedByRepository ? (
        <PanelState
          title="Remote membership actions are paused"
          description={
            repositoryConnectivity?.recovery ??
            'Reconnect the remote repository before inviting members or changing collaboration roles.'
          }
          tone="recovery"
        />
      ) : null}

      <div className="version-list">
        {isLoading ? (
          <PanelState
            title="Loading members"
            description="Refreshing project collaborators and invite state."
            tone="loading"
          />
        ) : isPendingCurrentAction ? (
          <PanelState
            title="Syncing member change"
            description="Applying the latest membership update and reconciling remote state."
            tone="recovery"
          />
        ) : recoveryMessage ? (
          <PanelState
            title="Member state needs recovery"
            description={recoveryMessage}
            tone="recovery"
            actionLabel={onRecover ? 'Retry members' : undefined}
            onAction={onRecover}
          />
        ) : members.length === 0 ? (
          <PanelState
            title="No members yet"
            description="Invite collaborators to review, edit, and publish this project."
          />
        ) : (
          members.map((member) => (
            <article key={member.userId} className="version-card">
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong>{member.email}</strong>
                  <span
                    style={{ fontSize: 12, color: '#0f766e', fontWeight: 600 }}
                  >
                    {formatPresenceLabel(member)}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {formatPresenceDetail(member)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <select
                    value={member.role}
                    onChange={(event) =>
                      onUpdateMemberRole(
                        member.userId,
                        event.target.value as BuilderRole
                      )
                    }
                    disabled={
                      !effectiveCanManageMembers || isPendingCurrentAction
                    }
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => onRemoveMember(member.userId)}
                    disabled={
                      !effectiveCanManageMembers || isPendingCurrentAction
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <label htmlFor="new-member-email">Invite member</label>
          <input
            id="new-member-email"
            value={newMemberEmail}
            onChange={(event) => onNewMemberEmailChange(event.target.value)}
            placeholder={
              managementBlockedByRepository
                ? 'Remote membership actions are paused until connectivity recovers.'
                : 'new.member@builder.dev'
            }
            disabled={!effectiveCanManageMembers || isPendingCurrentAction}
          />
          <select
            value={newMemberRole}
            onChange={(event) =>
              onNewMemberRoleChange(event.target.value as BuilderRole)
            }
            disabled={!effectiveCanManageMembers || isPendingCurrentAction}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddMember}
            disabled={!effectiveCanManageMembers || !newMemberEmail.trim()}
          >
            Invite member
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gap: 8,
            paddingTop: 8,
            borderTop: '1px solid #cbd5e1',
          }}
        >
          <label htmlFor="accept-invite-email">Accept invite</label>
          <input
            id="accept-invite-email"
            value={acceptedInviteEmail}
            onChange={(event) =>
              onAcceptedInviteEmailChange(event.target.value)
            }
            placeholder={
              managementBlockedByRepository
                ? 'Remote membership actions are paused until connectivity recovers.'
                : 'invited.member@builder.dev'
            }
            disabled={!effectiveCanManageMembers || isPendingCurrentAction}
          />
          <button
            type="button"
            onClick={onAcceptInvite}
            disabled={
              !effectiveCanManageMembers ||
              isPendingCurrentAction ||
              !acceptedInviteEmail.trim()
            }
          >
            Accept invite into session
          </button>
        </div>
      </div>
    </section>
  );
}
