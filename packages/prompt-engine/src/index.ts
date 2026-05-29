import { validateRequiredShape } from '@ui-construction-library/schema';

export type PromptGenerationMode =
  | 'landing-page'
  | 'dashboard'
  | 'marketing-section';

export type PromptRequest = {
  productType: string;
  targetAudience: string;
  sections: string[];
  styleTone: string;
  density: 'compact' | 'balanced' | 'spacious';
  domain: string;
  frameworkPreference: 'react';
  detailLevel: 'low' | 'medium' | 'high';
  generationMode: PromptGenerationMode;
};

export type NormalizedPromptRequest = PromptRequest & {
  normalizedSections: string[];
  promptSignature: string;
};

export type PromptAssumption = {
  code: string;
  message: string;
};

export type PromptAlternative = {
  code: string;
  label: string;
  reason: string;
};

export type PromptDraftNode = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: PromptDraftNode[];
};

export type PromptDraftPage = {
  id: string;
  title: string;
  root: PromptDraftNode;
};

export type PromptDraftProject = {
  id: string;
  name: string;
  pages: PromptDraftPage[];
};

export type PromptRepairDiagnostic = {
  code: string;
  message: string;
  severity: 'info' | 'warning';
};

export type PromptGenerationPolicyScore = {
  score: number;
  status: 'allow' | 'warn' | 'block';
  reasons: string[];
};

export type PromptRepairResult = {
  draft: PromptDraftProject;
  diagnostics: PromptRepairDiagnostic[];
  repaired: boolean;
  valid: boolean;
};

export type BuilderCompatibleProject = {
  id: string;
  name: string;
  pages: PromptDraftPage[];
  publish: {
    status: 'draft';
    publishedAt: null;
    publishedBy: null;
    sourceVersionId: null;
  };
  members: [];
};

export type PromptResponse = {
  chosenIntent: PromptGenerationMode;
  assembledSections: string[];
  assumptions: PromptAssumption[];
  alternatives: PromptAlternative[];
  draft: PromptDraftProject;
  repair: PromptRepairResult;
  policy: PromptGenerationPolicyScore;
  explainability: {
    recipeId: string;
    usedComponents: string[];
    validationPassed: boolean;
    compositionFamily: string;
    layoutRhythm: string;
  };
};

export type PromptDraftReviewSummary = {
  intent: PromptGenerationMode;
  compositionFamily: string;
  layoutRhythm: string;
  sectionCount: number;
  sectionLabels: string[];
  policyStatus: PromptGenerationPolicyScore['status'];
  policyReasons: string[];
};

export type PromptRecipeSummary = {
  signature: string;
  compositionFamily: string;
  layoutRhythm: string;
  componentFamily: string;
};

const MODE_SAFETY_RAILS: Record<PromptGenerationMode, readonly string[]> = {
  'landing-page': [
    'single primary page',
    'foundation registry components only',
  ],
  dashboard: ['summary-first layout', 'read-only placeholder metrics'],
  'marketing-section': ['single section output', 'copy kept deterministic'],
};

const DETERMINISTIC_USED_COMPONENTS = ['card', 'heading', 'text'] as const;

export function scorePromptRequest(
  request: PromptRequest
): PromptGenerationPolicyScore {
  const reasons: string[] = [];
  let score = 100;

  if (request.productType.trim().split(/\s+/).length < 2) {
    score -= 20;
    reasons.push('Product type is underspecified for a reliable scaffold.');
  }

  if (request.targetAudience.trim().length === 0) {
    score -= 20;
    reasons.push('Target audience is missing.');
  }

  if (request.sections.length < 2) {
    score -= 10;
    reasons.push(
      'Very few sections were requested, which weakens layout planning.'
    );
  }

  if (/mobile app|native app/i.test(request.productType)) {
    score -= 35;
    reasons.push(
      'Request implies a native/mobile app while the generator targets structured web UI.'
    );
  }

  if (
    /animation|motion-heavy|3d/i.test(
      `${request.productType} ${request.domain}`
    )
  ) {
    score -= 15;
    reasons.push(
      'Advanced motion requirements exceed the deterministic layout recipe baseline.'
    );
  }

  const status = score < 50 ? 'block' : score < 75 ? 'warn' : 'allow';

  if (reasons.length === 0) {
    reasons.push(
      'Prompt fits the deterministic structured-UI generation policy.'
    );
  }

  return { score, status, reasons };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'generated-draft'
  );
}

function uniqueOrdered(values: string[]): string[] {
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
      plan.compositionFamily === 'signal-first-dashboard'
        ? 'approved-dashboard-primitives'
        : plan.compositionFamily === 'campaign-focus'
          ? 'approved-campaign-primitives'
          : 'approved-layout-primitives',
  };
}

function makeTextNode(id: string, children: string): PromptDraftNode {
  return {
    id,
    componentId: 'text',
    props: { children, align: 'start' },
    children: [],
  };
}

type CompositionPlan = {
  compositionFamily:
    | 'hero-led'
    | 'feature-grid'
    | 'signal-first-dashboard'
    | 'campaign-focus';
  layoutRhythm: 'intro-heavy' | 'balanced-stack' | 'summary-detail';
  sectionPadding: 'sm' | 'md' | 'lg';
  heroShadow: 'sm' | 'md';
};

function deriveCompositionPlan(request: PromptRequest): CompositionPlan {
  if (request.generationMode === 'dashboard') {
    return {
      compositionFamily: 'signal-first-dashboard',
      layoutRhythm: 'summary-detail',
      sectionPadding: request.density === 'compact' ? 'sm' : 'md',
      heroShadow: 'sm',
    };
  }

  if (request.generationMode === 'marketing-section') {
    return {
      compositionFamily: 'campaign-focus',
      layoutRhythm: 'intro-heavy',
      sectionPadding: request.density === 'spacious' ? 'lg' : 'md',
      heroShadow: 'md',
    };
  }

  if (
    request.sections.includes('features') ||
    request.sections.includes('pricing')
  ) {
    return {
      compositionFamily: 'feature-grid',
      layoutRhythm: 'balanced-stack',
      sectionPadding:
        request.density === 'compact'
          ? 'sm'
          : request.density === 'spacious'
            ? 'lg'
            : 'md',
      heroShadow: 'md',
    };
  }

  return {
    compositionFamily: 'hero-led',
    layoutRhythm: 'intro-heavy',
    sectionPadding:
      request.density === 'compact'
        ? 'sm'
        : request.density === 'spacious'
          ? 'lg'
          : 'md',
    heroShadow: 'md',
  };
}

function makeSectionCopy(
  request: PromptRequest,
  section: string,
  index: number,
  plan: CompositionPlan
): string {
  if (index === 0) {
    return `A ${request.styleTone} ${request.domain} experience generated for ${request.targetAudience} with a ${plan.layoutRhythm} rhythm.`;
  }

  if (plan.compositionFamily === 'signal-first-dashboard') {
    return `Summary-first ${section} block for ${request.targetAudience}, tuned to ${request.density} information density.`;
  }

  if (plan.compositionFamily === 'campaign-focus') {
    return `Campaign-style ${section} content with deterministic hierarchy and ${request.styleTone} emphasis.`;
  }

  return `Deterministic ${section} content for a ${request.styleTone} ${request.productType} concept.`;
}

function makeSectionChildren(
  request: PromptRequest,
  section: string,
  index: number,
  plan: CompositionPlan
): PromptDraftNode[] {
  const baseId = `section-${index + 1}`;
  const title =
    index === 0
      ? `${request.productType} for ${request.targetAudience}`
      : section.charAt(0).toUpperCase() + section.slice(1);
  const nodes: PromptDraftNode[] = [
    makeHeadingNode(`${baseId}-heading`, index === 0 ? '1' : '2', title),
    makeTextNode(
      `${baseId}-copy`,
      makeSectionCopy(request, section, index, plan)
    ),
  ];

  if (
    section === 'metrics' ||
    section === 'analytics' ||
    section === 'activity'
  ) {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Key signals, KPI deltas, and operational summaries for ${request.targetAudience}.`
      )
    );
  } else if (section === 'pricing' || section === 'plans') {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Plan comparison scaffold with deterministic billing hierarchy and clear upgrade path.`
      )
    );
  } else if (section === 'faq' || section === 'docs' || section === 'setup') {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Reference-oriented section with concise onboarding detail and implementation guidance.`
      )
    );
  } else if (section === 'cta') {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Single conversion-focused action area with restrained hierarchy and explicit next step.`
      )
    );
  }

  return nodes;
}

function getSectionLayoutVariant(
  section: string,
  index: number,
  plan: CompositionPlan
): 'hero' | 'feature' | 'detail' | 'cta' {
  if (index === 0) return 'hero';
  if (section === 'cta' || section === 'pricing') return 'cta';
  if (plan.compositionFamily === 'signal-first-dashboard') return 'detail';
  return 'feature';
}

function makeHeadingNode(
  id: string,
  level: string,
  children: string
): PromptDraftNode {
  return {
    id,
    componentId: 'heading',
    props: { level, children },
    children: [],
  };
}

function buildLandingPageDraft(request: PromptRequest): PromptDraftProject {
  const normalizedRequest = normalizePromptRequest(request);
  const projectSlug = slugify(
    `${normalizedRequest.productType}-${normalizedRequest.targetAudience}`
  );
  const assembledSections = normalizedRequest.normalizedSections;
  const plan = deriveCompositionPlan(normalizedRequest);

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

export function getPromptGenerationSafetyRails(
  mode: PromptGenerationMode
): readonly string[] {
  return MODE_SAFETY_RAILS[mode];
}

export function validatePromptDraftProject(draft: PromptDraftProject): boolean {
  return (
    validateRequiredShape('project', draft) &&
    draft.pages.every((page) => validateRequiredShape('layout', page.root))
  );
}

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
      message: 'Missing project id was replaced with a deterministic fallback.',
      severity: 'warning',
    });
  }

  const projectName = draft.name?.trim() || 'Prompt Draft';
  if (projectName !== draft.name) {
    repaired = true;
    diagnostics.push({
      code: 'project-name-repaired',
      message:
        'Missing project name was replaced with a deterministic fallback.',
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
      message: 'Missing pages were replaced with a single generated page.',
      severity: 'warning',
    });
  }

  const pages = sourcePages.map((page, index) => {
    const pageId = page.id?.trim() || `generated-page-${index + 1}`;
    const title = page.title?.trim() || `Generated Page ${index + 1}`;
    const root = ensureRootNode(page.root);

    if (pageId !== page.id || title !== page.title || root !== page.root) {
      repaired = true;
      diagnostics.push({
        code: 'page-repaired',
        message: `Page ${index + 1} received deterministic fallback values where required.`,
        severity: 'info',
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
