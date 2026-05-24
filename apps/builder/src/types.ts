export type LayoutNode = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: LayoutNode[];
};

export type BuilderPage = {
  id: string;
  title: string;
  root: LayoutNode;
};

export type PublishStatus = 'draft' | 'published';

export type PublishRecord = {
  status: PublishStatus;
  publishedAt: string | null;
  publishedBy: string | null;
  sourceVersionId: string | null;
};

export type GovernanceEventKind =
  | 'member-added'
  | 'member-role-updated'
  | 'member-removed';

export type PublishEventType =
  | 'published'
  | 'unpublished'
  | 'restored-version'
  | GovernanceEventKind;

export type PublishEventRecord = {
  id: string;
  projectId: string;
  pageId: string | null;
  type: PublishEventType;
  actorId: string;
  createdAt: string;
  sourceVersionId: string | null;
  note: string | null;
  payload?: {
    kind: GovernanceEventKind;
    memberId?: string;
    memberEmail?: string;
    fromRole?: BuilderRole;
    toRole?: BuilderRole;
  };
};

export type BuilderRole = 'owner' | 'admin' | 'editor' | 'commenter' | 'viewer';

export type BuilderMember = {
  userId: string;
  email: string;
  role: BuilderRole;
};

export type BuilderProject = {
  id: string;
  name: string;
  pages: BuilderPage[];
  publish: PublishRecord;
  members: BuilderMember[];
};

export type BuilderSession = {
  userId: string;
  email: string;
  role: BuilderRole;
  provider: 'local' | 'supabase';
};

export type SessionRepository = {
  loadSessionMemberId: () => string | null;
  saveSessionMemberId: (memberId: string) => void;
  clearSessionMemberId: () => void;
  loadRoute: () => string | null;
  saveRoute: (route: string) => void;
  clearRoute: () => void;
};

export type PageVersion = {
  id: string;
  pageId: string;
  label: string;
  snapshot: LayoutNode;
  authorId: string;
  createdAt: string;
};

export type CommentRecord = {
  id: string;
  pageId: string;
  nodeId?: string;
  body: string;
  authorId: string;
  resolved: boolean;
  createdAt: string;
};

export type SupabaseLikeClient = {
  from: (table: string) => {
    select: (columns?: string) => Promise<{ data: unknown; error: unknown }>;
    upsert: (rows: unknown[]) => Promise<{ error: unknown }>;
  };
};
