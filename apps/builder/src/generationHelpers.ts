import type { PromptTemplate } from './promptModel';
import type { LayoutNode } from './types';

export function buildDiffSummary(
  currentBuilderSections: string[],
  nextSectionIds: string[]
) {
  return {
    addedSections: nextSectionIds.filter(
      (id) => !currentBuilderSections.includes(id)
    ),
    removedSections: currentBuilderSections.filter(
      (id) => !nextSectionIds.includes(id)
    ),
    persistedSections: nextSectionIds.filter((id) =>
      currentBuilderSections.includes(id)
    ),
  };
}

export function formatDiffSummary(summary: {
  addedSections: string[];
  removedSections: string[];
  persistedSections: string[];
}) {
  const addedCount = summary.addedSections.length;
  const removedCount = summary.removedSections.length;
  const persistedCount = summary.persistedSections.length;
  return `Semantically, this refresh adds ${addedCount} section${addedCount === 1 ? '' : 's'}, removes ${removedCount} section${removedCount === 1 ? '' : 's'}, and keeps ${persistedCount} section${persistedCount === 1 ? '' : 's'} intact.`;
}

export function getPromptTemplateById(
  templates: readonly PromptTemplate[],
  templateId: string
): PromptTemplate {
  return templates.find((entry) => entry.id === templateId) ?? templates[0];
}

export function getCurrentBuilderSections(children: LayoutNode[] | undefined) {
  return children?.map((node) => String(node.id)).filter(Boolean) ?? [];
}
