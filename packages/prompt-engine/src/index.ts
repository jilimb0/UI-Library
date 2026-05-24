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
  explainability: {
    recipeId: string;
    usedComponents: string[];
    validationPassed: boolean;
  };
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

function makeTextNode(id: string, children: string): PromptDraftNode {
  return {
    id,
    componentId: 'text',
    props: { children, align: 'start' },
    children: [],
  };
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
  const projectSlug = slugify(
    `${request.productType}-${request.targetAudience}`
  );
  const assembledSections = uniqueOrdered(
    request.sections.length > 0 ? request.sections : ['hero', 'features', 'cta']
  );

  const sectionChildren = assembledSections.map((section, index) => ({
    id: `section-${index + 1}`,
    componentId: 'card',
    props: {
      padding:
        request.density === 'compact'
          ? 'sm'
          : request.density === 'spacious'
            ? 'lg'
            : 'md',
      interactive: false,
      shadow: index === 0 ? 'md' : 'sm',
    },
    children: [
      makeHeadingNode(
        `section-${index + 1}-heading`,
        index === 0 ? '1' : '2',
        index === 0
          ? `${request.productType} for ${request.targetAudience}`
          : section.charAt(0).toUpperCase() + section.slice(1)
      ),
      makeTextNode(
        `section-${index + 1}-copy`,
        index === 0
          ? `A ${request.styleTone} ${request.domain} experience generated for ${request.targetAudience}.`
          : `Deterministic ${section} content for a ${request.styleTone} ${request.productType} concept.`
      ),
    ],
  }));

  return {
    id: `prompt-${projectSlug}`,
    name: `${request.productType} Prompt Draft`,
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
  const draft = buildLandingPageDraft(request);
  const repair = repairPromptDraftProject(draft);
  const assembledSections = uniqueOrdered(
    request.sections.length > 0 ? request.sections : ['hero', 'features', 'cta']
  );

  return {
    chosenIntent: request.generationMode,
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
    explainability: {
      recipeId: `deterministic-${request.generationMode}`,
      usedComponents: [...DETERMINISTIC_USED_COMPONENTS],
      validationPassed: repair.valid,
    },
  };
}
