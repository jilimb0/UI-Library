import {
  analyzeExportProject,
  appendDoctorArtifacts,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '@ui-construction-library/export-core';
import { useEffect, useMemo, useState } from 'react';
import { recordAnalyticsEvent } from './analytics';
import { getRecoveryDraftSummary } from './autosave';
import {
  useBuilderDataController,
  useBuilderEditorController,
} from './builderControllers';
import { buildValidationIssues } from './builderHealth';
import { type BuilderMode, changeBuilderMode } from './builderModeActions';
import {
  acceptSelectedGeneratedSection as acceptSelectedGeneratedSectionWorkflow,
  regenerateSelectedGeneratedSection as regenerateSelectedGeneratedSectionWorkflow,
  rejectSelectedGeneratedSection as rejectSelectedGeneratedSectionWorkflow,
  setSectionReviewState as setSectionReviewStateWorkflow,
  toggleProtectSelectedNode as toggleProtectSelectedNodeWorkflow,
} from './builderSelectionActions';
import { BuilderShell } from './components/BuilderShell';
import { CanvasReviewOverlay } from './components/CanvasReviewOverlay';
import { CanvasTree } from './components/CanvasTree';
import { CommentsPanel } from './components/CommentsPanel';
import { EventTimelinePanel } from './components/EventTimelinePanel';
import { InspectorPanel } from './components/InspectorPanel';
import { LayersTree } from './components/LayersTree';
import { PresenceBar } from './components/PresenceBar';
import { ProjectMembersPanel } from './components/ProjectMembersPanel';
import { PublishHistoryPanel } from './components/PublishHistoryPanel';
import { RecoveryBanner } from './components/RecoveryBanner';
import { RemoteSyncBanner } from './components/RemoteSyncBanner';
import { VersionsPanel } from './components/VersionsPanel';
import { formatDiffSummary, getPromptTemplateById } from './generationHelpers';
import {
  type GenerationSummary,
  refreshSectionDecisionsFromReviewState,
} from './generationState';
import { createPromptController } from './promptController';
import {
  buildClarificationPrompts,
  builderModeSections,
  buildTemplateLibrary,
  getSelectedTemplate,
  promptTemplates,
} from './promptModel';
import {
  generateDiffPreview as runDiffPreview,
  runPromptTemplate as runPromptTemplateWorkflow,
} from './promptWorkflow';
import { getRepositoryConnectivityStatus } from './repositoryConnectivity';
import {
  resolveRepositoryMode,
  setRepositoryModeOverride,
} from './repositoryFactory';
import { parseProjectRoute } from './routes';
import { getSupabaseConnectionStatus } from './supabaseClient';

export function App() {
  const projectRoute = parseProjectRoute(window.location.pathname);
  const [repositoryMode, setRepositoryMode] = useState(() =>
    resolveRepositoryMode()
  );
  const [commentDraft, setCommentDraft] = useState('');
  const [promptTemplateId, setPromptTemplateId] = useState('landing-page');
  const [promptDraft, setPromptDraft] = useState(
    'Build a clean landing page for a developer tool.'
  );
  const [audienceDraft, setAudienceDraft] = useState('product teams');
  const [explainPrompt, setExplainPrompt] = useState(false);
  const [showPromptEntry, setShowPromptEntry] = useState(false);
  const [showGenerationHistory, setShowGenerationHistory] = useState(false);
  const [builderMode, setBuilderMode] = useState<BuilderMode>('edit');
  useEffect(() => {
    recordAnalyticsEvent('builder_opened', 'builder', {
      route: window.location.pathname,
      repositoryMode,
    });
  }, []);

  useEffect(() => {
    if (builderMode === 'export') {
      recordAnalyticsEvent('export_mode_opened', 'export', {
        route: window.location.pathname,
      });
    }
  }, [builderMode]);

  const [multiSelectedNodeIds, _setMultiSelectedNodeIds] = useState<string[]>(
    []
  );
  const panelStatus = {
    comments: false,
    members: false,
    versions: false,
    publish: false,
  } as const;
  const panelRecovery = {
    comments: null,
    members: null,
    versions: null,
    publish: null,
  } as const;
  const [generationSummary, setGenerationSummary] =
    useState<GenerationSummary | null>(null);
  const [protectedNodeIds, setProtectedNodeIds] = useState<string[]>([]);
  const [generationHistory, setGenerationHistory] = useState<
    GenerationSummary[]
  >([]);
  const [pendingDiffSummary, setPendingDiffSummary] =
    useState<GenerationSummary['diffSummary']>(null);
  const supabaseStatus = getSupabaseConnectionStatus();
  const repositoryConnectivity = getRepositoryConnectivityStatus(
    repositoryMode,
    supabaseStatus
  );
  const repositoryStatusLabel = repositoryConnectivity.label;
  const repositoryStatusTone = repositoryConnectivity.tone;
  const repositoryStatusSummary = repositoryConnectivity.summary;
  const repositoryStatusGuidance = repositoryConnectivity.guidance;
  const repositoryStatusRecovery = repositoryConnectivity.recovery;
  const {
    projects,
    notice,
    versions,
    setVersions,
    setVersionsCount,
    comments,
    setComments,
    publishEvents: activityPublishEvents,
    versionsCount,
    commentsCount,
    versionDraft,
    setVersionDraft,
    setEditorState,
    setNotice,
    refreshActivity,
    hasAutosaveRecovery,
    restoreAutosaveDraft,
    discardAutosaveDraft,
  } = useBuilderDataController(repositoryMode);

  const recoverySummary = hasAutosaveRecovery
    ? getRecoveryDraftSummary()
    : null;
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
    sessionRole,
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
    publishStateSummary,
    publishStateGuidance,
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
    handleResolveComment,
    handleAcceptInvite,
    handleAddMember,
    handleUpdateMemberRole,
    handleRemoveMember,
    pendingMemberAction,
    activeMember,
    memberPresenceSummary,
    publishEvents,
  } = useBuilderEditorController({
    projects,
    setEditorState,
    setNotice,
    refreshActivity,
    versions,
    setVersions,
    setVersionsCount,
    comments,
    setComments,
    publishEvents: activityPublishEvents,
    versionsCount,
    commentsCount,
    versionDraft,
    commentDraft,
    setCommentDraft,
  });

  const exportPreview = useMemo(() => {
    if (!editorContext) return null;
    const exportRequest = createExportRequestFromBuilderProject(
      {
        id: editorContext.project.id,
        name: editorContext.project.name,
        pages: editorContext.project.pages.map((page, index) => ({
          id: page.id,
          title: index === 0 ? 'Current page' : page.title,
          root: page.root,
        })),
      },
      'react-single-page'
    );
    const normalized = normalizeExportProject(exportRequest);
    const analyzed = analyzeExportProject(normalized);
    const enriched = enrichExportProject(analyzed);
    const rendered = appendDoctorArtifacts(
      enriched,
      renderExportProject(enriched)
    );
    return { normalized, analyzed, enriched, rendered };
  }, [editorContext]);

  const _activeProjectForOverview = useMemo(() => {
    if (projectRoute) {
      return (
        projects.find((project) => project.id === projectRoute.projectId) ??
        null
      );
    }
    return editorContext?.project ?? null;
  }, [editorContext, projectRoute, projects]);

  const selectedTemplate = getSelectedTemplate(promptTemplateId);
  const templateLibrary = buildTemplateLibrary();
  const clarificationPrompts = buildClarificationPrompts(
    promptDraft,
    audienceDraft,
    selectedTemplate.id
  );

  const latestGenerationForEditor = generationHistory[0] ?? generationSummary;
  const validationIssues = buildValidationIssues(
    editorContext?.project ?? null
  );
  const _selectedNodeIssues = selectedNodeId
    ? validationIssues.filter((issue) => issue.nodeId === selectedNodeId)
    : [];
  const repairSuggestions = validationIssues
    .filter((issue) => issue.severity === 'error')
    .map((issue) => issue.message);
  const panelContextSummary = {
    selectedNodeId,
    selectedNodeLabel: selectedNode?.componentId ?? null,
    commentsOpen: comments.filter((comment) => !comment.resolved).length,
    versionCount: versions.length,
    memberCount: projectMembers.length,
    publishEventCount: publishEvents.length,
    memberPresenceSummary,
    activeMemberLabel: activeMember?.email ?? null,
  };
  const modeSections = builderModeSections;

  useEffect(() => {
    if (!editorContext) return;
    setGenerationSummary((current) => {
      return refreshSectionDecisionsFromReviewState(
        current,
        editorContext.page.root.children.map((section) => ({
          id: section.id,
          reviewState: (section.props as Record<string, unknown>).reviewState,
        }))
      );
    });
  }, [editorContext?.page.id]);

  function updateSectionDecision(
    nodeId: string,
    decision: 'pending' | 'accepted' | 'rejected'
  ) {
    setSectionReviewStateWorkflow(
      {
        selectedNodeId,
        selectedNode,
        editorContext,
        protectedNodeIds,
        setProtectedNodeIds,
        setGenerationSummary,
        setSelectedNodeId,
        setNotice,
        handleUpdateProps,
        handleRemoveSelected,
      },
      nodeId,
      decision
    );
  }

  function setSectionReviewState(
    nodeId: string,
    decision: 'pending' | 'accepted' | 'rejected'
  ) {
    updateSectionDecision(nodeId, decision);
  }

  function toggleProtectSelectedNode() {
    toggleProtectSelectedNodeWorkflow({
      selectedNodeId,
      setProtectedNodeIds,
      setGenerationSummary,
    });
  }

  function acceptSelectedGeneratedSection() {
    acceptSelectedGeneratedSectionWorkflow(
      { selectedNodeId, setNotice },
      (nodeId, decision) => setSectionReviewState(nodeId, decision)
    );
  }

  function rejectSelectedGeneratedSection() {
    rejectSelectedGeneratedSectionWorkflow({
      selectedNodeId,
      selectedNode,
      editorContext,
      protectedNodeIds,
      setProtectedNodeIds,
      setGenerationSummary,
      setSelectedNodeId,
      setNotice,
      handleUpdateProps,
      handleRemoveSelected,
    });
  }

  function regenerateSelectedGeneratedSection() {
    regenerateSelectedGeneratedSectionWorkflow({
      selectedNodeId,
      selectedNode,
      editorContext,
      protectedNodeIds,
      setProtectedNodeIds,
      setGenerationSummary,
      setSelectedNodeId,
      setNotice,
      handleUpdateProps,
      handleRemoveSelected,
    });
  }

  const generateDiffPreview = () =>
    runDiffPreview({
      editorPage: editorContext?.page ?? null,
      promptDraft,
      audienceDraft,
      selectedTemplate,
      setPendingDiffSummary,
      setNotice,
    });
  const latestPromptLinkedVersion = versions.find((version) =>
    version.label.startsWith('[Prompt] ')
  );

  const handleBuilderModeChange = (mode: BuilderMode) => {
    changeBuilderMode(setBuilderMode, mode);
  };

  const promptController = createPromptController({
    latestPromptLinkedVersion,
    generationSummary,
    editorPage: editorContext?.page ?? null,
    setGenerationSummary,
    setGenerationHistory,
    setPromptTemplateId,
    setPromptDraft,
    setAudienceDraft,
    setExplainPrompt,
    setShowPromptEntry,
    setShowGenerationHistory,
    setNotice,
    getPromptTemplateById: (id) => getPromptTemplateById(promptTemplates, id),
  });
  const linkLatestGenerationToVersion =
    promptController.linkLatestGenerationToVersion;
  const reopenGeneration = promptController.reopenGeneration;

  const runPromptTemplate = () =>
    runPromptTemplateWorkflow({
      editorPage: editorContext?.page ?? null,
      promptDraft,
      audienceDraft,
      selectedTemplate,
      protectedNodeIds,
      pendingDiffSummary,
      setNotice,
      setGenerationSummary,
      setGenerationHistory,
      setPendingDiffSummary,
      setPromptTemplateId,
      setPromptDraft,
      setAudienceDraft,
      setExplainPrompt,
      setShowPromptEntry,
      setShowGenerationHistory,
      handleGenerateProjectDraft,
    });

  if (route === '/') {
    return (
      <>
        {recoverySummary && (
          <RecoveryBanner
            summary={recoverySummary}
            onRestore={restoreAutosaveDraft}
            onDiscard={discardAutosaveDraft}
          />
        )}
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
      </>
    );
  }

  if (route === '/projects') {
    const switchToLocal = () => {
      setRepositoryMode('local');
      setRepositoryModeOverride('local');
      setNotice('Switched repository mode to local for safe editing.');
    };
    const remoteSyncBanner = (
      <RemoteSyncBanner
        repositoryConnectivity={repositoryConnectivity}
        onSwitchToLocal={switchToLocal}
      />
    );
    return (
      <>
        {recoverySummary && (
          <RecoveryBanner
            summary={recoverySummary}
            onRestore={restoreAutosaveDraft}
            onDiscard={discardAutosaveDraft}
          />
        )}
        <BuilderShell
          banner={remoteSyncBanner}
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
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPromptEntry((value) => !value);
                        setShowGenerationHistory(false);
                      }}
                    >
                      {showPromptEntry ? 'Close prompt' : 'Open prompt'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGenerationHistory((value) => !value);
                        setShowPromptEntry(false);
                      }}
                      disabled={generationHistory.length === 0}
                    >
                      {showGenerationHistory
                        ? 'Hide history'
                        : 'Prompt history'}
                    </button>
                    <button type="button" onClick={runPromptTemplate}>
                      Generate draft
                    </button>
                    <button type="button" onClick={generateDiffPreview}>
                      Preview diff
                    </button>
                  </div>
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
                        aria-label="Repository mode"
                        value={repositoryMode}
                        onChange={(event) => {
                          const nextMode = event.target.value as
                            | 'local'
                            | 'supabase';
                          setRepositoryMode(nextMode);
                          setRepositoryModeOverride(nextMode);
                        }}
                      >
                        <option value="local">local</option>
                        <option value="supabase">supabase</option>
                      </select>
                    </label>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>
                  Repository mode: {repositoryStatusLabel}.
                </p>
              </header>

              {showPromptEntry ? (
                <section
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    padding: 16,
                    display: 'grid',
                    gap: 12,
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() =>
                          editorContext &&
                          navigate(`/projects/${editorContext.project.id}`)
                        }
                      >
                        Project overview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBuilderModeChange('edit')}
                      >
                        Page overview
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(
                        [
                          'generate',
                          'edit',
                          'review',
                          'publish',
                          'export',
                        ] as BuilderMode[]
                      ).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleBuilderModeChange(mode)}
                          style={{
                            borderRadius: 999,
                            padding: '6px 12px',
                            border:
                              builderMode === mode
                                ? '1px solid #0f766e'
                                : '1px solid #cbd5e1',
                            background:
                              builderMode === mode ? '#ccfbf1' : '#ffffff',
                            color: builderMode === mode ? '#115e59' : '#334155',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {modeSections[mode].label}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569' }}>
                      Current mode:{' '}
                      <strong>{modeSections[builderMode].label}</strong> ·{' '}
                      {modeSections[builderMode].description}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <h2 style={{ margin: 0 }}>Prompt entry</h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
                      First-class prompt entry flow with templates, audience
                      hinting, and transparent generation choices.
                    </p>
                  </div>

                  <section style={{ display: 'grid', gap: 10 }}>
                    <div style={{ display: 'grid', gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        Guided templates
                      </span>
                      <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
                        Choose a scaffold with an explicit recipe, expected
                        sections, and density profile before you write the
                        prompt.
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gap: 10,
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, 1fr))',
                      }}
                    >
                      {templateLibrary.map((template) => {
                        const isSelected = template.id === selectedTemplate.id;
                        return (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => {
                              setPromptTemplateId(template.id);
                              setPromptDraft(template.samplePrompt);
                              setAudienceDraft(template.targetAudience);
                            }}
                            style={{
                              textAlign: 'left',
                              border: isSelected
                                ? '1px solid #0f766e'
                                : '1px solid #cbd5e1',
                              borderRadius: 12,
                              background: isSelected ? '#f0fdfa' : '#ffffff',
                              padding: 12,
                              display: 'grid',
                              gap: 6,
                            }}
                          >
                            <strong style={{ color: '#0f172a' }}>
                              {template.label}
                            </strong>
                            <span style={{ color: '#475569', fontSize: 13 }}>
                              {template.summary}
                            </span>
                            <span style={{ color: '#0f766e', fontSize: 12 }}>
                              {template.sections.join(' · ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <label style={{ display: 'grid', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        Template
                      </span>
                      <select
                        value={promptTemplateId}
                        onChange={(event) =>
                          setPromptTemplateId(event.target.value)
                        }
                      >
                        {promptTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </section>

                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>
                      Prompt
                    </span>
                    <textarea
                      value={promptDraft}
                      onChange={(event) => setPromptDraft(event.target.value)}
                      rows={4}
                      placeholder="Describe the page or product you want to generate"
                    />
                  </label>

                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>
                      Audience
                    </span>
                    <input
                      value={audienceDraft}
                      onChange={(event) => setAudienceDraft(event.target.value)}
                      placeholder="Who is this for?"
                    />
                  </label>

                  <label
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={explainPrompt}
                      onChange={(event) =>
                        setExplainPrompt(event.target.checked)
                      }
                    />
                    <span style={{ fontSize: 13 }}>
                      Show explainability after generation
                    </span>
                  </label>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={runPromptTemplate}
                      disabled={
                        clarificationPrompts.length > 0 && !promptDraft.trim()
                      }
                    >
                      Generate from template
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPromptEntry(false)}
                    >
                      Cancel
                    </button>
                  </div>

                  {clarificationPrompts.length > 0 ? (
                    <section
                      style={{
                        display: 'grid',
                        gap: 8,
                        padding: 12,
                        borderRadius: 10,
                        background: '#fff7ed',
                        border: '1px solid #fdba74',
                        fontSize: 13,
                      }}
                    >
                      <strong>Clarifications before generate</strong>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {clarificationPrompts.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  <div
                    style={{
                      display: 'grid',
                      gap: 8,
                      padding: 12,
                      borderRadius: 10,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: 13,
                    }}
                  >
                    <strong>Template preview</strong>
                    <div>{selectedTemplate.summary}</div>
                    <div>Mode: {selectedTemplate.label}</div>
                    <div>Sections: {selectedTemplate.sections.join(', ')}</div>
                    <div>Density: {selectedTemplate.density}</div>
                    <div>
                      Audience:{' '}
                      {audienceDraft || selectedTemplate.targetAudience}
                    </div>
                    <div>
                      Prompt intent:{' '}
                      {promptDraft.trim() || selectedTemplate.productType}
                    </div>
                    <div>
                      Explainability: {explainPrompt ? 'enabled' : 'off'}
                    </div>
                  </div>
                </section>
              ) : null}

              {pendingDiffSummary ? (
                <section
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    padding: 16,
                    display: 'grid',
                    gap: 10,
                    background: '#ffffff',
                  }}
                >
                  <h2 style={{ margin: 0 }}>Diffable regeneration preview</h2>
                  <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
                    Compare the next generated draft against the current builder
                    page before applying it.
                  </p>
                  <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
                    {formatDiffSummary(pendingDiffSummary)}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gap: 10,
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                    }}
                  >
                    <section
                      style={{
                        border: '1px solid #bbf7d0',
                        borderRadius: 10,
                        padding: 12,
                        background: '#f0fdf4',
                      }}
                    >
                      <strong>Added sections</strong>
                      <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                        {(pendingDiffSummary.addedSections.length
                          ? pendingDiffSummary.addedSections
                          : ['No new sections']
                        ).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section
                      style={{
                        border: '1px solid #fecaca',
                        borderRadius: 10,
                        padding: 12,
                        background: '#fef2f2',
                      }}
                    >
                      <strong>Removed sections</strong>
                      <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                        {(pendingDiffSummary.removedSections.length
                          ? pendingDiffSummary.removedSections
                          : ['No removed sections']
                        ).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section
                      style={{
                        border: '1px solid #bfdbfe',
                        borderRadius: 10,
                        padding: 12,
                        background: '#eff6ff',
                      }}
                    >
                      <strong>Persisted sections</strong>
                      <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                        {(pendingDiffSummary.persistedSections.length
                          ? pendingDiffSummary.persistedSections
                          : ['No persisted sections']
                        ).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </section>
              ) : null}

              {generationSummary && explainPrompt ? (
                <section
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    padding: 16,
                    display: 'grid',
                    gap: 12,
                    background: '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'grid', gap: 4 }}>
                      <h2 style={{ margin: 0 }}>Generation explainability</h2>
                      <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
                        Generated from {generationSummary.templateLabel} for{' '}
                        {generationSummary.audience} at{' '}
                        {generationSummary.createdAt}.
                      </p>
                    </div>
                    <span
                      style={{
                        alignSelf: 'start',
                        borderRadius: 999,
                        padding: '4px 10px',
                        background:
                          generationSummary.policyStatus === 'block'
                            ? '#fee2e2'
                            : generationSummary.policyStatus === 'warn'
                              ? '#fef3c7'
                              : '#dcfce7',
                        color:
                          generationSummary.policyStatus === 'block'
                            ? '#991b1b'
                            : generationSummary.policyStatus === 'warn'
                              ? '#92400e'
                              : '#166534',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Policy: {generationSummary.policyStatus} ·{' '}
                      {generationSummary.policyScore}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gap: 10,
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                    }}
                  >
                    <section
                      style={{
                        border: '1px solid #dbeafe',
                        borderRadius: 10,
                        padding: 12,
                        background: '#eff6ff',
                        display: 'grid',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <strong>Prompt intent</strong>
                      <div>{generationSummary.prompt}</div>
                      <div style={{ color: '#1d4ed8', fontSize: 12 }}>
                        Audience: {generationSummary.audience}
                      </div>
                    </section>
                    <section
                      style={{
                        border: '1px solid #ccfbf1',
                        borderRadius: 10,
                        padding: 12,
                        background: '#f0fdfa',
                        display: 'grid',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <strong>Chosen recipe</strong>
                      <div>{generationSummary.templateLabel}</div>
                      <div style={{ color: '#0f766e', fontSize: 12 }}>
                        Composition:{' '}
                        {generationSummary.compositionFamily ??
                          'deterministic baseline'}{' '}
                        · Rhythm:{' '}
                        {generationSummary.layoutRhythm ?? 'balanced-stack'}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {selectedTemplate.sections.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: 12,
                        background: '#ffffff',
                        display: 'grid',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <strong>Assumptions</strong>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {generationSummary.assumptions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: 12,
                        background: '#ffffff',
                        display: 'grid',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <strong>Fallback decisions</strong>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {generationSummary.fallbackDecisions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section
                      style={{
                        border: '1px solid #fecaca',
                        borderRadius: 10,
                        padding: 12,
                        background: '#fef2f2',
                        display: 'grid',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <strong>Safe generation policy</strong>
                      <div>
                        Status: {generationSummary.policyStatus} · Score{' '}
                        {generationSummary.policyScore}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {generationSummary.policyReasons.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section
                      style={{
                        border: '1px solid #fde68a',
                        borderRadius: 10,
                        padding: 12,
                        background: '#fffbeb',
                        display: 'grid',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <strong>Unsupported intents</strong>
                      <div>
                        {generationSummary.unsupportedIntent ??
                          'No unsupported intents detected for this prompt.'}
                      </div>
                    </section>
                  </div>
                </section>
              ) : null}

              {generationHistory.length > 0 ? (
                <section
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    padding: 16,
                    display: 'grid',
                    gap: 10,
                    background: '#fff',
                  }}
                >
                  <h2 style={{ margin: 0 }}>Prompt provenance</h2>
                  <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
                    Recent prompt-driven generations are kept here so draft
                    intent, assumptions, and fallbacks remain inspectable.
                  </p>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {generationHistory.map((entry) => (
                      <article
                        key={entry.id}
                        style={{
                          display: 'grid',
                          gap: 6,
                          padding: 12,
                          borderRadius: 10,
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          fontSize: 13,
                        }}
                      >
                        <strong>
                          {entry.templateLabel} · {entry.createdAt}
                        </strong>
                        <div>Audience: {entry.audience}</div>
                        <div>Prompt: {entry.prompt}</div>
                        <div>Assumptions: {entry.assumptions.join(' · ')}</div>
                        <div>
                          Fallbacks: {entry.fallbackDecisions.join(' · ')}
                        </div>
                        <div>
                          Unsupported intents:{' '}
                          {entry.unsupportedIntent ?? 'none detected'}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {notice ? <p>{notice}</p> : null}
            </section>
          }
          right={<div />}
        />
      </>
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

  const handleUpdatePropsWithReviewSync = (
    nodeId: string,
    key: string,
    value: string
  ) => {
    if (
      key === 'reviewState' &&
      (value === 'pending' || value === 'accepted' || value === 'rejected')
    ) {
      setSectionReviewState(nodeId, value);
      return;
    }
    handleUpdateProps(nodeId, key, value);
  };

  const selectedNodeReviewState =
    selectedNode &&
    typeof (selectedNode.props as Record<string, unknown>).reviewState ===
      'string'
      ? ((selectedNode.props as Record<string, unknown>).reviewState as string)
      : null;

  const switchToLocal = () => {
    setRepositoryMode('local');
    setRepositoryModeOverride('local');
    setNotice('Switched repository mode to local for safe editing.');
  };
  const remoteSyncBanner = (
    <RemoteSyncBanner
      repositoryConnectivity={repositoryConnectivity}
      onSwitchToLocal={switchToLocal}
    />
  );

  return (
    <BuilderShell
      banner={remoteSyncBanner}
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
                      aria-label="Repository mode"
                      value={repositoryMode}
                      onChange={(event) => {
                        const nextMode = event.target.value as
                          | 'local'
                          | 'memory'
                          | 'supabase';
                        setRepositoryModeOverride(nextMode);
                        setRepositoryMode(nextMode);
                        navigate(
                          `/projects/${editorContext.project.id}/pages/${editorContext.page.id}`
                        );
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
                        : repositoryMode === 'memory'
                          ? 'Builder is using the ephemeral in-memory repository.'
                          : 'Builder is using the local browser-backed repository.'
                    }
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: repositoryStatusTone.background,
                      color: repositoryStatusTone.color,
                      border: repositoryStatusTone.border,
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
              <div style={{ margin: '8px 0 4px 0' }}>
                <PresenceBar
                  members={projectMembers}
                  activeMemberId={sessionMemberId}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                {(
                  [
                    'generate',
                    'edit',
                    'review',
                    'publish',
                    'export',
                  ] as BuilderMode[]
                ).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleBuilderModeChange(mode)}
                    style={{
                      borderRadius: 999,
                      padding: '4px 8px',
                      border:
                        builderMode === mode
                          ? '1px solid #0f766e'
                          : '1px solid #cbd5e1',
                      background: builderMode === mode ? '#ccfbf1' : '#ffffff',
                      color: builderMode === mode ? '#115e59' : '#334155',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {modeSections[mode].label}
                  </button>
                ))}
              </div>
              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  background:
                    repositoryMode === 'supabase' &&
                    supabaseStatus.severity === 'error'
                      ? '#fef2f2'
                      : '#f8fafc',
                  border:
                    repositoryMode === 'supabase' &&
                    supabaseStatus.severity === 'error'
                      ? '1px solid #fca5a5'
                      : '1px solid #cbd5e1',
                }}
              >
                <strong style={{ fontSize: 13, color: '#0f172a' }}>
                  Repository state
                </strong>
                <span style={{ fontSize: 13, color: '#334155' }}>
                  {repositoryStatusSummary}
                </span>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    display: 'grid',
                    gap: 4,
                    color: '#475569',
                    fontSize: 12,
                  }}
                >
                  {repositoryStatusGuidance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      repositoryMode === 'supabase' &&
                      supabaseStatus.severity === 'error'
                        ? '#991b1b'
                        : repositoryMode === 'supabase' &&
                            supabaseStatus.severity === 'warning'
                          ? '#92400e'
                          : '#0f172a',
                  }}
                >
                  Recovery: {repositoryStatusRecovery}
                </span>
              </div>
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
            {builderMode === 'edit' && multiSelectedNodeIds.length > 1 ? (
              <section
                style={{
                  display: 'grid',
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                }}
              >
                <strong>Batch edit</strong>
                <div style={{ fontSize: 13, color: '#166534' }}>
                  Apply a shared tone/variant update across{' '}
                  {multiSelectedNodeIds.length} selected nodes.
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => {}}>
                    Set tone: muted
                  </button>
                  <button type="button" onClick={() => {}}>
                    Set variant: secondary
                  </button>
                </div>
              </section>
            ) : null}

            {builderMode === 'edit' && repairSuggestions.length ? (
              <section
                style={{
                  display: 'grid',
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  background: '#ecfeff',
                  border: '1px solid #67e8f9',
                }}
              >
                <strong>Repair suggestions</strong>
                <div style={{ display: 'grid', gap: 6 }}>
                  {repairSuggestions.slice(0, 5).map((suggestion) => (
                    <div
                      key={suggestion}
                      style={{ fontSize: 13, color: '#155e75' }}
                    >
                      • {suggestion}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {builderMode === 'edit' && validationIssues.length ? (
              <section
                style={{
                  display: 'grid',
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  background: '#fff7ed',
                  border: '1px solid #fdba74',
                }}
              >
                <strong>Validation overlay</strong>
                <div style={{ fontSize: 13, color: '#9a3412' }}>
                  {validationIssues.length} issue(s) detected in the current
                  canvas structure.
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {validationIssues.slice(0, 4).map((issue) => (
                    <button
                      key={`${issue.nodeId}-${issue.message}`}
                      type="button"
                      onClick={() => setSelectedNodeId(issue.nodeId)}
                      style={{
                        textAlign: 'left',
                        borderRadius: 10,
                        border: '1px solid #fdba74',
                        background: '#ffffff',
                        padding: 10,
                        display: 'grid',
                        gap: 4,
                      }}
                    >
                      <strong>{issue.nodeId}</strong>
                      <span style={{ fontSize: 12, color: '#9a3412' }}>
                        {issue.message}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {builderMode === 'generate' && latestGenerationForEditor ? (
              <section
                style={{
                  display: 'grid',
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  background: '#ecfeff',
                  border: '1px solid #67e8f9',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <strong>Generated from prompt</strong>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#155e75',
                      background: '#cffafe',
                      borderRadius: 999,
                      padding: '4px 8px',
                    }}
                  >
                    {latestGenerationForEditor.templateLabel}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#0f172a' }}>
                  {latestGenerationForEditor.prompt}
                </div>
                <div style={{ fontSize: 12, color: '#155e75' }}>
                  Audience: {latestGenerationForEditor.audience} · Generated at{' '}
                  {latestGenerationForEditor.createdAt}
                </div>
                <div style={{ fontSize: 12, color: '#164e63' }}>
                  Assumptions:{' '}
                  {latestGenerationForEditor.assumptions.join(' · ')}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowPromptEntry(true)}
                  >
                    Refine prompt
                  </button>
                  <button type="button" onClick={generateDiffPreview}>
                    Preview diff
                  </button>
                  <button type="button" onClick={runPromptTemplate}>
                    Regenerate draft
                  </button>
                  <button
                    type="button"
                    onClick={linkLatestGenerationToVersion}
                    disabled={!latestPromptLinkedVersion}
                  >
                    Link latest prompt version
                  </button>
                </div>
                <div style={{ fontSize: 12, color: '#164e63' }}>
                  {latestGenerationForEditor.linkedVersionId
                    ? `Linked version: ${latestGenerationForEditor.linkedVersionLabel ?? latestGenerationForEditor.linkedVersionId} · ${latestGenerationForEditor.linkedVersionCreatedAt ?? 'timestamp unavailable'}`
                    : latestPromptLinkedVersion
                      ? `Latest prompt version available: ${latestPromptLinkedVersion.label}`
                      : 'Save a version with a [Prompt] label to connect this generation to a recoverable snapshot.'}
                </div>

                {selectedNode ? (
                  <section
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: 12,
                      display: 'grid',
                      gap: 8,
                      background: '#f8fafc',
                    }}
                  >
                    <strong>Section generation controls</strong>
                    <div style={{ fontSize: 13, color: '#334155' }}>
                      Selected node: {selectedNode.id} · status:{' '}
                      {selectedNodeReviewState ?? 'not-tracked'}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569' }}>
                      Protection:{' '}
                      {protectedNodeIds.includes(selectedNode.id)
                        ? 'enabled'
                        : 'off'}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={acceptSelectedGeneratedSection}
                      >
                        Accept section
                      </button>
                      <button
                        type="button"
                        onClick={rejectSelectedGeneratedSection}
                      >
                        Reject section
                      </button>
                      <button
                        type="button"
                        onClick={regenerateSelectedGeneratedSection}
                      >
                        Regenerate section
                      </button>
                      <button type="button" onClick={toggleProtectSelectedNode}>
                        {protectedNodeIds.includes(selectedNode.id)
                          ? 'Unprotect section'
                          : 'Protect section'}
                      </button>
                    </div>
                  </section>
                ) : null}

                <section
                  style={{
                    display: 'grid',
                    gap: 8,
                    padding: 12,
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <strong>Prompt history</strong>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {generationHistory.slice(0, 5).map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => reopenGeneration(entry)}
                        style={{
                          textAlign: 'left',
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                          borderRadius: 10,
                          padding: 10,
                          display: 'grid',
                          gap: 4,
                        }}
                      >
                        <strong>{entry.templateLabel}</strong>
                        <span style={{ fontSize: 12, color: '#475569' }}>
                          {entry.prompt}
                        </span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>
                          {entry.createdAt} ·{' '}
                          {entry.linkedVersionLabel ?? 'Unlinked draft'} ·{' '}
                          {entry.snapshotLabel ?? 'No snapshot'}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {latestGenerationForEditor.diffSummary ? (
                  <div style={{ fontSize: 12, color: '#155e75' }}>
                    Diff preview · +
                    {latestGenerationForEditor.diffSummary.addedSections.length}{' '}
                    / -
                    {
                      latestGenerationForEditor.diffSummary.removedSections
                        .length
                    }{' '}
                    / =
                    {
                      latestGenerationForEditor.diffSummary.persistedSections
                        .length
                    }
                  </div>
                ) : null}
              </section>
            ) : null}

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
                id="session-member-select"
                aria-label="Session member"
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

            <div
              style={{
                display: 'grid',
                gap: 8,
                padding: 12,
                borderRadius: 12,
                background: publishGuardReason ? '#fff7ed' : '#f8fafc',
                color: publishGuardReason ? '#9a3412' : '#334155',
                border: publishGuardReason
                  ? '1px solid #fdba74'
                  : '1px solid #cbd5e1',
              }}
            >
              <strong style={{ color: '#0f172a', fontSize: 13 }}>
                Publish readiness
              </strong>
              <span style={{ fontSize: 13 }}>{publishStateSummary}</span>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  display: 'grid',
                  gap: 4,
                  fontSize: 12,
                }}
              >
                {publishStateGuidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {publishGuardReason ? (
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  Publish blocked: {publishGuardReason}
                </span>
              ) : null}
            </div>
          </section>

          {builderMode !== 'publish' && builderMode !== 'export' ? (
            <LayersTree
              root={editorContext.page.root}
              selectedNodeId={selectedNodeId}
              selectedNodeIds={multiSelectedNodeIds}
              onSelectNode={setSelectedNodeId}
              onDuplicateNode={canEdit ? handleDuplicateSelected : () => {}}
              onDeleteNode={canEdit ? handleRemoveSelected : () => {}}
            />
          ) : (
            <section
              style={{
                display: 'grid',
                gap: 8,
                fontSize: 13,
                color: '#475569',
              }}
            >
              <strong>
                {builderMode === 'publish'
                  ? 'Publish mode focus'
                  : 'Export mode focus'}
              </strong>
              <span>
                Layer navigation is de-emphasized in this mode so release
                workflows stay primary.
              </span>
            </section>
          )}
        </div>
      }
      center={
        <div style={{ display: 'grid', gap: 16 }}>
          {builderMode === 'review' && (
            <CanvasReviewOverlay
              sections={editorContext.page.root.children}
              sectionDecisions={generationSummary?.sectionDecisions ?? {}}
              selectedNodeId={selectedNodeId}
              onSelectNode={(id) => setSelectedNodeId(id)}
              onAccept={(id) => {
                setSectionReviewState(id, 'accepted');
                setNotice('Section marked as accepted.');
              }}
              onReject={(id) => {
                setSectionReviewState(id, 'rejected');
                setNotice('Section marked as rejected.');
              }}
              onReset={(id) => {
                setSectionReviewState(id, 'pending');
                setNotice('Section reset to pending.');
              }}
            />
          )}
          <CanvasTree
            node={editorContext.page.root}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
            onUpdateProps={handleUpdatePropsWithReviewSync}
          />
        </div>
      }
      right={
        <div style={{ display: 'grid', gap: 16 }}>
          {builderMode === 'edit' ? (
            <InspectorPanel
              node={selectedNode}
              componentMeta={selectedMeta ?? undefined}
              onChangeProp={handleUpdatePropsWithReviewSync}
            />
          ) : null}

          {builderMode === 'review' ? (
            <>
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
                sessionRole={sessionRole}
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
                isLoading={panelStatus.members}
                recoveryMessage={panelRecovery.members}
                onRecover={() => {
                  if (editorContext)
                    void refreshActivity(editorContext.page.id);
                }}
                repositoryStatusLabel={repositoryStatusLabel}
                repositoryStatusSummary={repositoryStatusSummary}
                repositoryStatusRecovery={repositoryStatusRecovery}
                activeMember={activeMember}
                memberPresenceSummary={memberPresenceSummary}
                pendingMemberAction={pendingMemberAction}
              />
              <section
                style={{
                  display: 'grid',
                  gap: 6,
                  padding: 12,
                  borderRadius: 12,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                }}
              >
                <strong>Review snapshot</strong>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  Selected node:{' '}
                  {panelContextSummary.selectedNodeLabel ?? 'none'} · Open
                  comments: {panelContextSummary.commentsOpen} · Versions:{' '}
                  {panelContextSummary.versionCount}
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Active as{' '}
                  {panelContextSummary.activeMemberLabel ?? 'unknown member'} ·{' '}
                  {panelContextSummary.memberPresenceSummary}
                </span>
              </section>
              <EventTimelinePanel
                events={publishEvents}
                repositoryStatusLabel={repositoryStatusLabel}
                repositoryStatusSummary={repositoryStatusSummary}
                repositoryStatusRecovery={repositoryStatusRecovery}
                repositoryConnectivity={repositoryConnectivity}
              />
              <CommentsPanel
                comments={comments}
                commentDraft={commentDraft}
                selectedNodeId={selectedNodeId}
                canComment={canComment}
                onDraftChange={setCommentDraft}
                onCreateComment={() => {
                  void handleAddComment();
                }}
                onResolveComment={(commentId) => {
                  void handleResolveComment(commentId);
                }}
                repositoryConnectivity={repositoryConnectivity}
              />
            </>
          ) : null}

          {builderMode === 'publish' ? (
            <>
              <h2>Publish project</h2>
              <section
                style={{
                  display: 'grid',
                  gap: 6,
                  padding: 12,
                  borderRadius: 12,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                }}
              >
                <strong>Publish snapshot</strong>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  Members: {panelContextSummary.memberCount} · Publish events:{' '}
                  {panelContextSummary.publishEventCount} · Selected node:{' '}
                  {panelContextSummary.selectedNodeLabel ?? 'none'}
                </span>
              </section>
              <EventTimelinePanel
                events={publishEvents}
                repositoryStatusLabel={repositoryStatusLabel}
                repositoryStatusSummary={repositoryStatusSummary}
                repositoryStatusRecovery={repositoryStatusRecovery}
                repositoryConnectivity={repositoryConnectivity}
              />
              <PublishHistoryPanel
                events={publishEvents}
                isLoading={panelStatus.publish}
                recoveryMessage={panelRecovery.publish}
                onRecover={() => {
                  if (editorContext)
                    void refreshActivity(editorContext.page.id);
                }}
                repositoryStatusLabel={repositoryStatusLabel}
                repositoryStatusSummary={repositoryStatusSummary}
                repositoryStatusRecovery={repositoryStatusRecovery}
                repositoryConnectivity={repositoryConnectivity}
              />
            </>
          ) : null}

          {builderMode === 'export' ? (
            <section
              style={{
                display: 'grid',
                gap: 8,
                padding: 12,
                borderRadius: 12,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
              }}
            >
              <strong>Export handoff</strong>
              <div style={{ fontSize: 13, color: '#334155' }}>
                Export mode is reserved for packaging, diagnostics, and
                downstream target workflows in Phase C/D.
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Current page: {editorContext.page.title} · Versions available:{' '}
                {versions.length}
              </div>
              {exportPreview ? (
                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    padding: 12,
                    borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                    color: '#334155',
                  }}
                >
                  <strong>Export diagnostics</strong>
                  <div>
                    Diagnostics:{' '}
                    {(exportPreview.rendered as { diagnostics: unknown[] })
                      .diagnostics.length +
                      (exportPreview.analyzed as { diagnostics: unknown[] })
                        .diagnostics.length}
                  </div>
                  <div>
                    Unsupported nodes:{' '}
                    {
                      (
                        exportPreview.analyzed as {
                          unsupportedNodeIds: unknown[];
                        }
                      ).unsupportedNodeIds.length
                    }
                  </div>
                  <div>
                    Doctor status:{' '}
                    {(
                      exportPreview.rendered as { files: { path: string }[] }
                    ).files.some((file) => file.path === 'EXPORT_DOCTOR.md')
                      ? 'available'
                      : 'missing'}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      }
    />
  );
}
