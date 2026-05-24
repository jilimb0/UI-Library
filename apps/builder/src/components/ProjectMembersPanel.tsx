import type { BuilderMember, BuilderRole } from '../types';

type Props = {
  members: BuilderMember[];
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
}: Props) {
  return (
    <section className="stack-panel">
      <div className="section-header">
        <div>
          <h3>Project members</h3>
          <p className="muted small">
            Manage collaboration roles for this project.
          </p>
        </div>
      </div>

      <div className="version-list">
        {members.map((member) => (
          <article key={member.userId} className="version-card">
            <div style={{ display: 'grid', gap: 8 }}>
              <div>
                <strong>{member.email}</strong>
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
                  disabled={!canManageMembers}
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
                  disabled={!canManageMembers}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <label htmlFor="invite-email">Invite email</label>
          <input
            id="invite-email"
            value={newMemberEmail}
            onChange={(event) => onNewMemberEmailChange(event.target.value)}
            placeholder="new.member@builder.dev"
            disabled={!canManageMembers}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={newMemberRole}
            onChange={(event) =>
              onNewMemberRoleChange(event.target.value as BuilderRole)
            }
            disabled={!canManageMembers}
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
            disabled={!canManageMembers}
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
            placeholder="invited.member@builder.dev"
            disabled={!canManageMembers}
          />
          <button
            type="button"
            onClick={onAcceptInvite}
            disabled={!canManageMembers}
          >
            Accept invite
          </button>
        </div>
      </div>
    </section>
  );
}
