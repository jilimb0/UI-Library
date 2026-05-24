import { describe, expect, it } from 'vitest';
import { createGovernanceEvent } from './eventFactories';

describe('eventFactories', () => {
  it('creates a member-added governance event', () => {
    const event = createGovernanceEvent({
      projectId: 'project-1',
      actorId: 'owner-1',
      kind: 'member-added',
      member: { userId: 'member-1', email: 'new@builder.dev', role: 'editor' },
    });

    expect(event.type).toBe('member-added');
    expect(event.payload?.kind).toBe('member-added');
    expect(event.note).toMatch(/Added new@builder.dev/);
  });

  it('creates a member-role-updated governance event', () => {
    const event = createGovernanceEvent({
      projectId: 'project-1',
      actorId: 'owner-1',
      kind: 'member-role-updated',
      member: { userId: 'member-1', email: 'new@builder.dev', role: 'editor' },
      nextRole: 'admin',
    });

    expect(event.payload?.toRole).toBe('admin');
    expect(event.note).toMatch(/editor to admin/);
  });
});
