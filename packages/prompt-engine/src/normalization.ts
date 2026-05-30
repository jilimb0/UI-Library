import type { NormalizedPromptRequest, PromptRequest } from './types';

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'generated-draft'
  );
}

export function uniqueOrdered(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function normalizePromptRequest(
  request: PromptRequest
): NormalizedPromptRequest {
  const normalizedSections = uniqueOrdered(
    request.sections.length > 0 ? request.sections : ['hero', 'features', 'cta']
  );
  const promptSignature = [
    request.productType.trim().toLowerCase(),
    request.targetAudience.trim().toLowerCase(),
    request.domain.trim().toLowerCase(),
    request.styleTone.trim().toLowerCase(),
    request.density,
    request.generationMode,
    request.componentFamily ?? 'default',
    [...normalizedSections]
      .sort((left, right) => left.localeCompare(right))
      .join('|'),
  ].join('::');

  return {
    ...request,
    normalizedSections,
    promptSignature,
  };
}
