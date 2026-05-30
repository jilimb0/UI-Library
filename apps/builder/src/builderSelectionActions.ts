import type { Dispatch, SetStateAction } from 'react';
import type { GenerationSummary } from './generationState';
import { mergeProtectedNodeId, mergeSectionDecision } from './generationState';
import type { BuilderPage, BuilderProject, LayoutNode } from './types';

type SelectionActionDeps = {
  selectedNodeId: string | null;
  selectedNode: LayoutNode | null;
  editorContext: { project: BuilderProject; page: BuilderPage } | null;
  protectedNodeIds: string[];
  setProtectedNodeIds: Dispatch<SetStateAction<string[]>>;
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  handleUpdateProps: (nodeId: string, prop: string, value: string) => void;
  handleRemoveSelected: () => void;
};

export function updateSectionDecision(
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>,
  nodeId: string,
  decision: 'pending' | 'accepted' | 'rejected'
) {
  setGenerationSummary((current) =>
    mergeSectionDecision(current, nodeId, decision)
  );
}

export function setSectionReviewState(
  deps: SelectionActionDeps,
  nodeId: string,
  decision: 'pending' | 'accepted' | 'rejected'
) {
  deps.handleUpdateProps(nodeId, 'reviewState', decision);
  updateSectionDecision(deps.setGenerationSummary, nodeId, decision);
}

export function toggleProtectSelectedNode(
  deps: Pick<
    SelectionActionDeps,
    'selectedNodeId' | 'setProtectedNodeIds' | 'setGenerationSummary'
  >
) {
  if (!deps.selectedNodeId) return;
  deps.setProtectedNodeIds((current) =>
    current.includes(deps.selectedNodeId!)
      ? current.filter((id) => id !== deps.selectedNodeId)
      : [...current, deps.selectedNodeId!]
  );
  deps.setGenerationSummary((current) =>
    mergeProtectedNodeId(current, deps.selectedNodeId!)
  );
}

export function acceptSelectedGeneratedSection(
  deps: Pick<SelectionActionDeps, 'selectedNodeId' | 'setNotice'>,
  setSectionReviewStateFn: (
    nodeId: string,
    decision: 'pending' | 'accepted' | 'rejected'
  ) => void
) {
  if (!deps.selectedNodeId) return;
  setSectionReviewStateFn(deps.selectedNodeId, 'accepted');
  deps.setNotice('Selected generated section marked as accepted.');
}

export function rejectSelectedGeneratedSection(deps: SelectionActionDeps) {
  if (!deps.selectedNodeId || !deps.editorContext) return;
  const rejectedNodeId = deps.selectedNodeId;
  deps.handleRemoveSelected();
  updateSectionDecision(deps.setGenerationSummary, rejectedNodeId, 'rejected');
  deps.setSelectedNodeId(null);
  deps.setNotice(
    'Selected generated section was rejected and removed from the page.'
  );
}

export function regenerateSelectedGeneratedSection(deps: SelectionActionDeps) {
  if (!deps.selectedNodeId || !deps.selectedNode || !deps.editorContext) return;
  if (deps.protectedNodeIds.includes(deps.selectedNodeId)) {
    deps.setNotice(
      'This section is protected and cannot be regenerated until protection is removed.'
    );
    return;
  }

  deps.handleUpdateProps(
    deps.selectedNodeId,
    'generationStatus',
    'regenerated'
  );
  deps.handleUpdateProps(
    deps.selectedNodeId,
    'generatedAt',
    new Date().toISOString()
  );
  deps.handleUpdateProps(
    deps.selectedNodeId,
    'provenanceLabel',
    'Regenerated section draft'
  );
  deps.handleUpdateProps(deps.selectedNodeId, 'reviewState', 'accepted');
  updateSectionDecision(
    deps.setGenerationSummary,
    deps.selectedNodeId,
    'accepted'
  );
  deps.setNotice('Selected generated section was regenerated in place.');
}
