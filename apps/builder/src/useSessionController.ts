import { useEffect, useMemo, useState } from 'react';
import { createSessionFromMember } from './auth';
import {
  getE2ERoleOverride,
  resolveBuilderRoleCapabilities,
} from './builderCapabilities';
import { getSupabaseSessionIdentity } from './supabaseClient';
import type { BuilderMember, SessionRepository } from './types';

export function useSessionController({
  projectMembers,
  sessionRepository,
}: {
  projectMembers: BuilderMember[];
  sessionRepository: SessionRepository;
}) {
  const [sessionMemberId, setSessionMemberId] = useState(
    () => sessionRepository.loadSessionMemberId() ?? 'local-owner'
  );

  const activeMember =
    projectMembers.find((member) => member.userId === sessionMemberId) ??
    projectMembers[0] ??
    null;

  const e2eRoleOverride = getE2ERoleOverride();
  const sessionRole = e2eRoleOverride ?? activeMember?.role ?? 'viewer';
  const session = useMemo(() => {
    const supabaseIdentity = getSupabaseSessionIdentity();

    if (activeMember) {
      return {
        ...createSessionFromMember(activeMember, supabaseIdentity.provider),
        role: e2eRoleOverride ?? activeMember.role,
      };
    }

    return createSessionFromMember(
      {
        userId:
          supabaseIdentity.status === 'authenticated'
            ? supabaseIdentity.userId
            : 'local-viewer',
        email:
          supabaseIdentity.status === 'authenticated'
            ? supabaseIdentity.email
            : 'viewer@builder.dev',
        role: e2eRoleOverride ?? 'viewer',
      },
      supabaseIdentity.provider
    );
  }, [activeMember, e2eRoleOverride]);

  const roleCapabilities = useMemo(
    () => resolveBuilderRoleCapabilities(sessionRole),
    [sessionRole]
  );

  useEffect(() => {
    if (projectMembers.length === 0) {
      sessionRepository.clearSessionMemberId();
      return;
    }
    if (!projectMembers.some((member) => member.userId === sessionMemberId)) {
      const fallbackMemberId = projectMembers[0].userId;
      setSessionMemberId(fallbackMemberId);
      sessionRepository.saveSessionMemberId(fallbackMemberId);
      return;
    }
    sessionRepository.saveSessionMemberId(sessionMemberId);
  }, [projectMembers, sessionMemberId, sessionRepository]);

  return {
    activeMember,
    roleCapabilities,
    session,
    sessionMemberId,
    sessionRepository,
    sessionRole,
    setSessionMemberId,
  };
}
