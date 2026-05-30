import { foundationalComponents } from '@ui-construction-library/registry';
import type { BuilderProject, LayoutNode } from './types';
import { collectValidationIssues } from './validation';

export type BuilderValidationIssueView = {
  nodeId: string;
  message: string;
  severity?: string;
};

export function buildValidationIssues(
  project: BuilderProject | null
): BuilderValidationIssueView[] {
  if (!project) return [];
  return project.pages.flatMap((page) =>
    collectValidationIssues(page.root as LayoutNode, foundationalComponents)
  );
}
