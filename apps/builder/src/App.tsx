import { useState } from 'react';
import {
  useBuilderDataController,
  useBuilderEditorController,
} from './builderControllers';
import { BuilderShell } from './components/BuilderShell';
import { CanvasTree } from './components/CanvasTree';
import { CommentsPanel } from './components/CommentsPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { LayersTree } from './components/LayersTree';
import { ProjectMembersPanel } from './components/ProjectMembersPanel';
import { PublishHistoryPanel } from './components/PublishHistoryPanel';
import { VersionsPanel } from './components/VersionsPanel';
import {
  resolveRepositoryMode,
  setRepositoryModeOverride,
} from './repositoryFactory';
import { getSupabaseConnectionStatus } from './supabaseClient';

export function App() {
  const [repositoryMode, setRepositoryMode] = useState(() =>
    resolveRepositoryMode()
  );
  const [commentDraft, setCommentDraft] = useState('');
  const supabaseStatus = getSupabaseConnectionStatus();
  const repositoryStatusLabel =
    repositoryMode === 'supabase'
      ? supabaseStatus.mode === 'configured'
        ? 'remote configured'
        : 'stub client'
      : 'local runtime';
  const {
    projects,
    notice,
    versions,
    comments,
    publishEvents: activityPublishEvents,
    versionsCount,
    commentsCount,
    versionDraft,
    setVersionDraft,
    setEditorState,
    setNotice,
    refreshActivity,
  } = useBuilderDataController();
  const {
    route,
    selectedNodeId,
    setSelectedNodeId,
    projectRenameDraft,
    setProjectRenameDraft,
    newPageTitle,
    setNewPageTitle,
    canEdit,
    canComment,
    canManageLifecycle,
    canSaveVersions,
    canRestoreVersions,
    projectMembers,
    newMemberEmail,
    setNewMemberEmail,
    newMemberRole,
    setNewMemberRole,
    acceptedInviteEmail,
    setAcceptedInviteEmail,
    sessionMemberId,
    setSessionMemberId,
    publishGuardReason,
    editorContext,
    selectedNode,
    selectedMeta,
    navigate,
    handleRenameProject,
    handleCreatePage,
    handleGenerateProjectDraft,
    handleDuplicateSelected,
    handleRemoveSelected,
    handleUpdateProps,
    handleSaveVersion,
    handleRestoreVersion,
    handleAddComment,
    handleAcceptInvite,
    handleAddMember,
    handleUpdateMemberRole,
    handleRemoveMember,
    publishEvents,
  } = useBuilderEditorController({
    projects,
    setEditorState,
    setNotice,
    refreshActivity,
    versions,
    comments,
    publishEvents: activityPublishEvents,
    versionsCount,
    commentsCount,
    versionDraft,
    commentDraft,
    setCommentDraft,
  });

  const projectList = projects.map((project) => ({
    id: project.id,
    name: project.name,
    pages: project.pages.map((page) => ({ id: page.id, title: page.title })),
    publishStatus: project.publish.status,
  }));

  if (route === '/') {
    return (
      <BuilderShell
        left={<div />}
        center={
          <section style={{ display: 'grid', gap: 12 }}>
            <h1 style={{ margin: 0 }}>UI Construction Library Builder</h1>
            <p style={{ margin: 0, color: '#475569' }}>
              Registry-backed builder shell with routes for projects, editor,
              comments, versions, and publish lifecycle.
            </p>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              style={{ width: 'fit-content' }}
            >
              Open projects
            </button>
          </section>
        }
        right={<div />}
      />
    );
  }

  if (route === '/projects') {
    return (
      <BuilderShell
        left={<div />}
        center={
          <section style={{ display: 'grid', gap: 16 }}>
            <header style={{ display: 'grid', gap: 4 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <h1 style={{ margin: 0 }}>Projects</h1>
                <button type="button" onClick={handleGenerateProjectDraft}>
                  Generate draft
                </button>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    <span>Repository mode</span>
                    <select
                      value={repositoryMode}
                      onChange={(event) => {
                        const nextMode = event.target.value as
                          | 'local'
                          | 'memory'
                          | 'supabase';
                        setRepositoryModeOverride(nextMode);
                        setRepositoryMode(nextMode);
                        window.location.reload();
                      }}
                    >
                      <option value="local">local</option>
                      <option value="memory">memory</option>
                      <option value="supabase">supabase</option>
                    </select>
                  </label>
                  <span
                    title={
                      repositoryMode === 'supabase'
                        ? supabaseStatus.detail
                        : 'Builder is using a non-remote repository mode.'
                    }
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background:
                        repositoryMode === 'supabase' &&
                        supabaseStatus.mode === 'configured'
                          ? '#dcfce7'
                          : '#fef3c7',
                      color:
                        repositoryMode === 'supabase' &&
                        supabaseStatus.mode === 'configured'
                          ? '#166534'
                          : '#92400e',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {repositoryStatusLabel}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, color: '#475569' }}>
                Select a project to enter the page editor.
              </p>
            </header>

            <div style={{ display: 'grid', gap: 12 }}>
              {projectList.map((project) => (
                <article
                  key={project.id}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    padding: 16,
                    display: 'grid',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'grid', gap: 4 }}>
                    <strong>{project.name}</strong>
                    <span style={{ color: '#64748b' }}>
                      {project.pages.length} page(s)
                    </span>
                    <span
                      style={{
                        color:
                          project.publishStatus === 'published'
                            ? '#15803d'
                            : '#b45309',
                      }}
                    >
                      {project.publishStatus === 'published'
                        ? 'Published'
                        : 'Draft'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {project.pages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() =>
                          navigate(`/projects/${project.id}/pages/${page.id}`)
                        }
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        }
        right={<div />}
      />
    );
  }

  if (!editorContext) {
    return (
      <BuilderShell
        left={<div />}
        center={
          <section style={{ display: 'grid', gap: 12 }}>
            <h1 style={{ margin: 0 }}>Page not found</h1>
            <button type="button" onClick={() => navigate('/projects')}>
              Back to projects
            </button>
          </section>
        }
        right={<div />}
      />
    );
  }

  return (
    <BuilderShell
      left={
        <div style={{ display: 'grid', gap: 16 }}>
          <header style={{ display: 'grid', gap: 8 }}>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              style={{ width: 'fit-content' }}
            >
              ← Projects
            </button>
            <div style={{ display: 'grid', gap: 4 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <h1 style={{ margin: 0 }}>{editorContext.project.name}</h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    <span>Repository mode</span>
                    <select
                      value={repositoryMode}
                      onChange={(event) => {
                        const nextMode = event.target.value as
                          | 'local'
                          | 'memory'
                          | 'supabase';
                        setRepositoryModeOverride(nextMode);
                        setRepositoryMode(nextMode);
                        window.location.reload();
                      }}
                    >
                      <option value="local">local</option>
                      <option value="memory">memory</option>
                      <option value="supabase">supabase</option>
                    </select>
                  </label>
                  <span
                    title={
                      repositoryMode === 'supabase'
                        ? supabaseStatus.detail
                        : 'Builder is using a non-remote repository mode.'
                    }
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background:
                        repositoryMode === 'supabase' &&
                        supabaseStatus.mode === 'configured'
                          ? '#dcfce7'
                          : '#fef3c7',
                      color:
                        repositoryMode === 'supabase' &&
                        supabaseStatus.mode === 'configured'
                          ? '#166534'
                          : '#92400e',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {repositoryStatusLabel}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, color: '#475569' }}>
                Editing page: <strong>{editorContext.page.title}</strong>
              </p>
              <p
                style={{
                  margin: 0,
                  color:
                    editorContext.project.publish.status === 'published'
                      ? '#15803d'
                      : '#b45309',
                }}
              >
                Status:{' '}
                {editorContext.project.publish.status === 'published'
                  ? 'Published'
                  : 'Draft'}
                {editorContext.project.publish.publishedAt
                  ? ` · ${new Date(editorContext.project.publish.publishedAt).toLocaleString()}`
                  : ''}
                {editorContext.project.publish.sourceVersionId
                  ? ` · version ${editorContext.project.publish.sourceVersionId}`
                  : ''}
              </p>
            </div>
            {notice ? (
              <div
                style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  borderRadius: 10,
                  padding: '10px 12px',
                }}
              >
                {notice}
              </div>
            ) : null}
          </header>

          <section style={{ display: 'grid', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <strong>Session member</strong>
              <select
                value={sessionMemberId}
                onChange={(event) => setSessionMemberId(event.target.value)}
              >
                {projectMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.email} · {member.role}
                  </option>
                ))}
              </select>
              <span style={{ color: '#475569', fontSize: 12 }}>
                Permissions: {canEdit ? 'edit ' : ''}
                {canComment ? 'comment ' : ''}
                {canManageLifecycle ? 'lifecycle ' : ''}
                {canSaveVersions ? 'save-version ' : ''}
                {canRestoreVersions ? 'restore-version ' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {editorContext.project.pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/projects/${editorContext.project.id}/pages/${page.id}`
                    )
                  }
                  style={{
                    background:
                      page.id === editorContext.page.id ? '#0f172a' : '#e2e8f0',
                    color:
                      page.id === editorContext.page.id ? '#fff' : '#0f172a',
                  }}
                >
                  {page.title}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                value={projectRenameDraft}
                onChange={(event) => setProjectRenameDraft(event.target.value)}
                placeholder="Rename project"
              />
              <button type="button" onClick={handleRenameProject}>
                Rename project
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                value={newPageTitle}
                onChange={(event) => setNewPageTitle(event.target.value)}
                placeholder="New page title"
              />
              <button type="button" onClick={handleCreatePage}>
                Add page
              </button>
            </div>

            {publishGuardReason ? (
              <div
                style={{
                  background: '#fff7ed',
                  color: '#9a3412',
                  borderRadius: 10,
                  padding: '10px 12px',
                }}
              >
                Publish blocked: {publishGuardReason}
              </div>
            ) : null}
          </section>

          <LayersTree
            root={editorContext.page.root}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onDuplicateNode={canEdit ? handleDuplicateSelected : () => {}}
            onDeleteNode={canEdit ? handleRemoveSelected : () => {}}
          />
        </div>
      }
      center={
        <CanvasTree
          node={editorContext.page.root}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
      }
      right={
        <div style={{ display: 'grid', gap: 16 }}>
          <InspectorPanel
            node={selectedNode}
            componentMeta={selectedMeta ?? undefined}
            onChangeProp={handleUpdateProps}
          />
          <VersionsPanel
            versions={versions}
            versionDraft={versionDraft}
            canSaveVersion={canSaveVersions}
            canRestoreVersion={canRestoreVersions}
            onDraftChange={setVersionDraft}
            onCreateVersion={handleSaveVersion}
            onRestoreVersion={handleRestoreVersion}
          />
          <ProjectMembersPanel
            members={projectMembers}
            canManageMembers={canManageLifecycle}
            newMemberEmail={newMemberEmail}
            onNewMemberEmailChange={setNewMemberEmail}
            newMemberRole={newMemberRole}
            onNewMemberRoleChange={setNewMemberRole}
            acceptedInviteEmail={acceptedInviteEmail}
            onAcceptedInviteEmailChange={setAcceptedInviteEmail}
            onAddMember={handleAddMember}
            onAcceptInvite={handleAcceptInvite}
            onUpdateMemberRole={handleUpdateMemberRole}
            onRemoveMember={handleRemoveMember}
          />
          <PublishHistoryPanel events={publishEvents} />
          <CommentsPanel
            comments={comments}
            commentDraft={commentDraft}
            selectedNodeId={selectedNodeId}
            canComment={canComment}
            onDraftChange={setCommentDraft}
            onCreateComment={() => {
              void handleAddComment();
            }}
            onResolveComment={() => {}}
          />
        </div>
      }
    />
  );
}
