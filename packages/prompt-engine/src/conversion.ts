import {
  buildLandingPageDraft,
  DETERMINISTIC_USED_COMPONENTS,
  deriveCompositionPlan,
} from './generation';
import { normalizePromptRequest } from './normalization';
import { repairPromptDraftProject } from './repair';
import { scorePromptRequest } from './scoring';
import type {
  BuilderCompatibleProject,
  PromptDraftProject,
  PromptDraftReviewSummary,
  PromptRecipeSummary,
  PromptRequest,
  PromptResponse,
} from './types';

export function toBuilderCompatibleProject(
  draft: PromptDraftProject
): BuilderCompatibleProject {
  const repaired = repairPromptDraftProject(draft);

  return {
    id: repaired.draft.id,
    name: repaired.draft.name,
    pages: repaired.draft.pages,
    publish: {
      status: 'draft',
      publishedAt: null,
      publishedBy: null,
      sourceVersionId: null,
    },
    members: [],
  };
}

export function summarizePromptRecipe(
  request: PromptRequest
): PromptRecipeSummary {
  const normalized = normalizePromptRequest(request);
  const plan = deriveCompositionPlan(normalized);

  return {
    signature: normalized.promptSignature,
    compositionFamily: plan.compositionFamily,
    layoutRhythm: plan.layoutRhythm,
    componentFamily:
      request.componentFamily ??
      (plan.compositionFamily === 'signal-first-dashboard'
        ? 'approved-dashboard-primitives'
        : plan.compositionFamily === 'campaign-focus'
          ? 'approved-campaign-primitives'
          : plan.compositionFamily === 'form-driven-settings'
            ? 'approved-form-primitives'
            : plan.compositionFamily === 'docs-structured'
              ? 'approved-docs-primitives'
              : plan.compositionFamily === 'pricing-tiered'
                ? 'approved-pricing-primitives'
                : plan.compositionFamily === 'onboarding-linear'
                  ? 'approved-onboarding-primitives'
                  : 'approved-layout-primitives'),
  };
}

export function generatePromptDraft(request: PromptRequest): PromptResponse {
  const normalizedRequest = normalizePromptRequest(request);
  const draft = buildLandingPageDraft(normalizedRequest);
  const repair = repairPromptDraftProject(draft);
  const assembledSections = normalizedRequest.normalizedSections;
  const compositionPlan = deriveCompositionPlan(normalizedRequest);

  return {
    chosenIntent: normalizedRequest.generationMode,
    assembledSections,
    assumptions: [
      {
        code: 'registry-foundations-only',
        message:
          'The deterministic baseline uses only currently registered foundation components.',
      },
      {
        code: 'single-generated-page',
        message:
          'The first Phase 6 slice emits one builder-compatible page per prompt request.',
      },
    ],
    alternatives: [
      {
        code: 'marketing-section',
        label: 'Generate a single marketing section',
        reason:
          'Use when the request should augment an existing page instead of creating a full draft.',
      },
      {
        code: 'dashboard',
        label: 'Generate a dashboard shell',
        reason:
          'Use when the requested concept is operational rather than promotional.',
      },
    ],
    draft: repair.draft,
    repair,
    policy: scorePromptRequest(request),
    explainability: {
      recipeId: `deterministic-${normalizedRequest.generationMode}`,
      usedComponents: [...DETERMINISTIC_USED_COMPONENTS],
      validationPassed: repair.valid,
      compositionFamily: compositionPlan.compositionFamily,
      layoutRhythm: compositionPlan.layoutRhythm,
    },
  };
}

export function summarizePromptResponse(
  response: PromptResponse
): PromptDraftReviewSummary {
  return {
    intent: response.chosenIntent,
    compositionFamily: response.explainability.compositionFamily,
    layoutRhythm: response.explainability.layoutRhythm,
    sectionCount: response.assembledSections.length,
    sectionLabels: response.assembledSections.map(
      (section) => section.charAt(0).toUpperCase() + section.slice(1)
    ),
    policyStatus: response.policy.status,
    policyReasons: response.policy.reasons,
  };
}
