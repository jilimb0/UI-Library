/**
 * Draft generation orchestrator.
 *
 * Composes compositionPlan + sectionBuilder into a complete PromptDraftProject.
 * CompositionPlan logic lives in compositionPlan.ts.
 * Section/node building logic lives in sectionBuilder.ts.
 */

import { validateRequiredShape } from '@ui-construction-library/schema';
import { type CompositionPlan, deriveCompositionPlan } from './compositionPlan';
import { normalizePromptRequest, slugify } from './normalization';
import {
  getSectionLayoutVariant,
  makeHeadingNode,
  makeSectionChildren,
  makeTextNode,
} from './sectionBuilder';
import type { PromptDraftProject, PromptRequest } from './types';

// Re-export for consumers that import from generation.ts directly.
export type { CompositionPlan };
export { deriveCompositionPlan, makeHeadingNode, makeTextNode };

// ── Constants ────────────────────────────────────────────────────────────────

export const DETERMINISTIC_USED_COMPONENTS = [
  'card',
  'heading',
  'text',
] as const;

// ── Draft builder ─────────────────────────────────────────────────────────────

export function buildLandingPageDraft(
  request: PromptRequest
): PromptDraftProject {
  const normalizedRequest = normalizePromptRequest(request);
  const projectSlug = slugify(
    `${normalizedRequest.productType}-${normalizedRequest.targetAudience}`
  );
  const assembledSections = normalizedRequest.normalizedSections;
  const plan: CompositionPlan = deriveCompositionPlan(normalizedRequest);

  const sectionChildren = assembledSections.map((section, index) => ({
    id: `section-${index + 1}`,
    componentId: 'card',
    props: {
      padding: plan.sectionPadding,
      interactive: false,
      shadow: index === 0 ? plan.heroShadow : 'sm',
      layoutVariant: getSectionLayoutVariant(section, index, plan),
      layoutRhythm: plan.layoutRhythm,
      compositionFamily: plan.compositionFamily,
      reviewState: 'pending',
    },
    children: makeSectionChildren(request, section, index, plan),
  }));

  return {
    id: `prompt-${projectSlug}`,
    name: `${normalizedRequest.productType} Prompt Draft`,
    pages: [
      {
        id: 'generated-page',
        title: 'Generated Draft',
        root: {
          id: 'generated-root',
          componentId: 'card',
          props: { padding: 'lg', interactive: false, shadow: 'sm' },
          children: sectionChildren,
        },
      },
    ],
  };
}

// ── Validation ────────────────────────────────────────────────────────────────

export function validatePromptDraftProject(draft: PromptDraftProject): boolean {
  return (
    validateRequiredShape('project', draft) &&
    draft.pages.every((page) => validateRequiredShape('layout', page.root))
  );
}
