import type {
  BuilderMember,
  BuilderRole,
  BuilderSession,
  SessionRepository,
} from './types';

export function createLocalSession(
  role: BuilderRole = 'owner'
): BuilderSession {
  return createSessionFromMember({
    userId: `local-${role}`,
    email: `${role}@builder.dev`,
    role,
  });
}

export function createSessionFromMember(
  member: BuilderMember,
  provider: BuilderSession['provider'] = 'local'
): BuilderSession {
  return {
    userId: member.userId,
    email: member.email,
    role: member.role,
    provider,
  };
}

export function canEditLayout(session: BuilderSession): boolean {
  return (
    session.role === 'owner' ||
    session.role === 'admin' ||
    session.role === 'editor'
  );
}

export function canComment(session: BuilderSession): boolean {
  return canEditLayout(session) || session.role === 'commenter';
}

export function canManageProject(session: BuilderSession): boolean {
  return session.role === 'owner' || session.role === 'admin';
}

export function canManagePublishLifecycle(session: BuilderSession): boolean {
  return session.role === 'owner' || session.role === 'admin';
}

export function canSaveVersion(session: BuilderSession): boolean {
  return canEditLayout(session);
}

export function canRestoreVersion(session: BuilderSession): boolean {
  return canManagePublishLifecycle(session);
}

export function createLocalSessionRepository(
  storageKey = 'ui-library-builder-session-member-id'
): SessionRepository {
  const routeKey = `${storageKey}:route`;

  return {
    loadSessionMemberId: () =>
      globalThis.localStorage?.getItem(storageKey) ?? null,
    saveSessionMemberId: (memberId) => {
      globalThis.localStorage?.setItem(storageKey, memberId);
    },
    clearSessionMemberId: () => {
      globalThis.localStorage?.removeItem(storageKey);
    },
    loadRoute: () => globalThis.localStorage?.getItem(routeKey) ?? null,
    saveRoute: (route) => {
      globalThis.localStorage?.setItem(routeKey, route);
    },
    clearRoute: () => {
      globalThis.localStorage?.removeItem(routeKey);
    },
  };
}

export function createSessionRepository(
  storageKey = 'ui-library-builder-session-member-id'
): SessionRepository {
  return createLocalSessionRepository(storageKey);
}
