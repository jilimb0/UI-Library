import type { RegistryComponent } from '@ui-construction-library/registry';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { createInitialEditorState } from './editorState';
import {
  commitProjects,
  redoProjects,
  undoProjects,
  updatePageRoot,
} from './editorState';
import { getInsertionBlockReason } from './insertionRules';
import {
  addChildNode,
  duplicateNode,
  findNode,
  removeNode,
  updateNodeProps,
} from './tree';
import type { BuilderPage, LayoutNode } from './types';

export function useNodeEditor({
  editorContext,
  setEditorState,
  setNotice,
  componentLibrary,
  touchMemberActivity,
}: {
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: BuilderPage;
  } | null;
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  setNotice: Dispatch<SetStateAction<string | null>>;
  componentLibrary: RegistryComponent[];
  touchMemberActivity: (pageId: string | null) => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(() => {
    if (!editorContext || !selectedNodeId) return null;
    return findNode(editorContext.page.root, selectedNodeId) ?? null;
  }, [editorContext, selectedNodeId]);

  const selectedMeta = useMemo(() => {
    if (!selectedNode) return null;
    return (
      componentLibrary.find(
        (component) => component.id === selectedNode.componentId
      ) ?? null
    );
  }, [componentLibrary, selectedNode]);

  const updateCurrentPage = (updater: (root: LayoutNode) => LayoutNode) => {
    if (!editorContext) return;
    setEditorState((prev) => {
      const nextProjects = updatePageRoot(
        prev.projects,
        editorContext.project.id,
        editorContext.page.id,
        updater
      );
      return commitProjects(prev, nextProjects);
    });
  };

  const handleInsertComponent = (componentId: string) => {
    if (!editorContext) return;
    const reason = getInsertionBlockReason(
      componentLibrary,
      componentId,
      editorContext.page.root
    );
    if (reason) {
      setNotice(reason);
      return;
    }
    const nextNode: LayoutNode = {
      id: `${componentId}-${Date.now()}`,
      componentId,
      props: {},
      children: [],
    };
    updateCurrentPage((root) => addChildNode(root, root.id, nextNode));
    touchMemberActivity(editorContext.page.id);
    setSelectedNodeId(nextNode.id);
    setNotice('Inserted component.');
  };

  const handleDuplicateSelected = () => {
    if (!editorContext || !selectedNodeId) return;
    updateCurrentPage((root) =>
      duplicateNode(root, selectedNodeId, Date.now().toString(36))
    );
    touchMemberActivity(editorContext.page.id);
    setNotice('Duplicated selected node.');
  };

  const handleRemoveSelected = () => {
    if (!editorContext || !selectedNodeId) return;
    updateCurrentPage((root) => removeNode(root, selectedNodeId));
    touchMemberActivity(editorContext.page.id);
    setSelectedNodeId(null);
    setNotice('Removed selected node.');
  };

  const handleUpdateProps = (nodeId: string, key: string, value: string) => {
    if (!editorContext) return;
    updateCurrentPage((root) =>
      updateNodeProps(root, nodeId, { [key]: value })
    );
    touchMemberActivity(editorContext.page.id);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier || event.key.toLowerCase() !== 'z') return;
      event.preventDefault();
      if (event.shiftKey) {
        setEditorState((prev) => redoProjects(prev));
      } else {
        setEditorState((prev) => undoProjects(prev));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setEditorState]);

  return {
    handleDuplicateSelected,
    handleInsertComponent,
    handleRemoveSelected,
    handleUpdateProps,
    selectedMeta,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    updateCurrentPage,
  };
}
