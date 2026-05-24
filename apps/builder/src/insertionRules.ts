import type { RegistryComponent } from '@ui-construction-library/registry';
import type { LayoutNode } from './types';

export function getInsertionBlockReason(
  components: RegistryComponent[],
  componentId: string,
  targetNode: LayoutNode | null
): string | null {
  const targetMeta = targetNode
    ? components.find((item) => item.id === targetNode.componentId)
    : undefined;
  const candidateMeta = components.find((item) => item.id === componentId);
  if (!candidateMeta) return 'Unknown component metadata.';

  if (targetNode && targetMeta && !targetMeta.builder.allowChildren) {
    return `Target "${targetNode.componentId}" does not allow children.`;
  }

  const rules = candidateMeta.builder.insertionRules;
  if (!rules) return null;
  if (rules.requiresSelectedParent && !targetNode)
    return 'Select a parent node first.';
  if (targetNode && rules.blockedParentIds?.includes(targetNode.componentId)) {
    return `Cannot insert ${componentId} inside ${targetNode.componentId}.`;
  }
  if (
    targetNode &&
    rules.allowedParentIds &&
    !rules.allowedParentIds.includes(targetNode.componentId)
  ) {
    return `Can only be inserted into: ${rules.allowedParentIds.join(', ')}.`;
  }
  if (targetNode && rules.blockedInsideInteractive) {
    const targetRules = targetMeta?.builder.insertionRules;
    if (targetRules?.blockedInsideInteractive) {
      return `Cannot nest interactive "${componentId}" inside interactive "${targetNode.componentId}".`;
    }
  }
  return null;
}
