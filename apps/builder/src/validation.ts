import type { RegistryComponent } from '@ui-construction-library/registry';
import type { BuilderValidationIssue, LayoutNode } from './types';

function walk(
  node: LayoutNode,
  visit: (node: LayoutNode, parent: LayoutNode | null) => void,
  parent: LayoutNode | null = null
) {
  visit(node, parent);
  node.children.forEach((child) => {
    walk(child, visit, node);
  });
}

export function collectValidationIssues(
  root: LayoutNode,
  components: RegistryComponent[]
): BuilderValidationIssue[] {
  const issues: BuilderValidationIssue[] = [];

  walk(root, (node, parent) => {
    const meta = components.find((item) => item.id === node.componentId);
    if (!meta) {
      issues.push({
        nodeId: node.id,
        severity: 'error',
        message: `Missing registry metadata for ${node.componentId}.`,
        suggestion: 'Replace or repair this node before publishing.',
      });
      return;
    }

    if (!meta.builder.allowChildren && node.children.length > 0) {
      issues.push({
        nodeId: node.id,
        severity: 'error',
        message: `${node.componentId} should not contain child nodes.`,
        suggestion: 'Move nested content into a container component.',
      });
    }

    const rules = meta.builder.insertionRules;
    if (
      parent &&
      rules?.allowedParentIds &&
      !rules.allowedParentIds.includes(parent.componentId)
    ) {
      issues.push({
        nodeId: node.id,
        severity: 'error',
        message: `${node.componentId} is placed inside an unsupported parent (${parent.componentId}).`,
        suggestion: `Move this node into one of: ${rules.allowedParentIds.join(', ')}.`,
      });
    }

    if (parent && rules?.blockedParentIds?.includes(parent.componentId)) {
      issues.push({
        nodeId: node.id,
        severity: 'error',
        message: `${node.componentId} cannot be nested inside ${parent.componentId}.`,
        suggestion: 'Choose a neutral container or sibling placement instead.',
      });
    }

    if (
      parent &&
      rules?.blockedInsideInteractive &&
      components.find((item) => item.id === parent.componentId)?.builder
        .insertionRules?.blockedInsideInteractive
    ) {
      issues.push({
        nodeId: node.id,
        severity: 'warning',
        message: `${node.componentId} is nested inside another interactive component.`,
        suggestion:
          'Flatten the interaction hierarchy to avoid ambiguous focus behavior.',
      });
    }
  });

  return issues;
}
