import { validateRequiredShape } from '@ui-construction-library/schema';
import {
  makeHeadingNode,
  makeTextNode,
  validatePromptDraftProject,
} from './generation';
import type {
  PromptDraftNode,
  PromptDraftProject,
  PromptRepairDiagnostic,
  PromptRepairResult,
} from './types';

function ensureNodeChildren(node: PromptDraftNode): PromptDraftNode {
  return {
    ...node,
    children: Array.isArray(node.children)
      ? node.children.map(ensureNodeChildren)
      : [],
  };
}

function ensureRootNode(
  root: PromptDraftNode | null | undefined
): PromptDraftNode {
  if (root && validateRequiredShape('layout', root)) {
    return ensureNodeChildren(root);
  }

  return {
    id: 'generated-root',
    componentId: 'card',
    props: { padding: 'lg', interactive: false, shadow: 'sm' },
    children: [
      makeHeadingNode('generated-root-heading', '2', 'Generated draft'),
      makeTextNode('generated-root-copy', 'Recovered prompt draft content.'),
    ],
  };
}

export function repairPromptDraftProject(
  draft: PromptDraftProject
): PromptRepairResult {
  const diagnostics: PromptRepairDiagnostic[] = [];
  let repaired = false;

  const projectId = draft.id?.trim() || 'prompt-generated-project';
  if (projectId !== draft.id) {
    repaired = true;
    diagnostics.push({
      code: 'project-id-repaired',
      message:
        'Missing project id was replaced with a deterministic fallback. Fix: ensure the prompt request includes a non-empty product type so the id can be derived from it.',
      severity: 'warning',
    });
  }

  const projectName = draft.name?.trim() || 'Prompt Draft';
  if (projectName !== draft.name) {
    repaired = true;
    diagnostics.push({
      code: 'project-name-repaired',
      message:
        'Missing project name was replaced with a deterministic fallback. Fix: set productType in the PromptRequest to a non-empty string so the name can be derived.',
      severity: 'warning',
    });
  }

  const sourcePages =
    draft.pages.length > 0
      ? draft.pages
      : [{ id: '', title: '', root: undefined as unknown as PromptDraftNode }];
  if (draft.pages.length === 0) {
    repaired = true;
    diagnostics.push({
      code: 'pages-repaired',
      message:
        'Missing pages were replaced with a single generated page. Fix: verify that buildLandingPageDraft returned at least one page — this usually means the sections array was empty.',
      severity: 'warning',
    });
  }

  const pages = sourcePages.map((page, index) => {
    const pageId = page.id?.trim() || `generated-page-${index + 1}`;
    const title = page.title?.trim() || `Generated Page ${index + 1}`;
    const root = ensureRootNode(page.root);

    if (pageId !== page.id) {
      repaired = true;
      diagnostics.push({
        code: 'page-id-repaired',
        message: `Page ${index + 1} had a missing id. Fix: ensure each page in the draft has a non-empty id string derived from the section slug.`,
        severity: 'info',
      });
    }

    if (title !== page.title) {
      repaired = true;
      diagnostics.push({
        code: 'page-title-repaired',
        message: `Page ${index + 1} had a missing title. Fix: set the page title from the generation mode label or the first section name.`,
        severity: 'info',
      });
    }

    if (root !== page.root) {
      repaired = true;
      diagnostics.push({
        code: 'page-root-repaired',
        message: `Page ${index + 1} had an invalid or missing root node. Fix: check that buildLandingPageDraft produces a root card node with at least one child section.`,
        severity: 'warning',
      });
    }

    return { id: pageId, title, root };
  });

  const repairedDraft: PromptDraftProject = {
    id: projectId,
    name: projectName,
    pages,
  };

  return {
    draft: repairedDraft,
    diagnostics,
    repaired,
    valid: validatePromptDraftProject(repairedDraft),
  };
}
