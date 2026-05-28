import type { BuilderValidationIssue } from './types';

export function summarizeRepairActions(
  issues: BuilderValidationIssue[]
): string[] {
  const actions = new Set<string>();
  for (const issue of issues) {
    actions.add(issue.suggestion);
    if (issue.message.includes('interactive component')) {
      actions.add(
        'Reduce nested click targets so focus and keyboard behavior stays predictable.'
      );
    }
    if (issue.message.includes('unsupported parent')) {
      actions.add(
        'Move the node into a compatible section or wrap it with a supported layout container.'
      );
    }
    if (issue.message.includes('should not contain child nodes')) {
      actions.add(
        'Detach child nodes and place them into a stack, grid, or section component.'
      );
    }
  }
  return Array.from(actions);
}
