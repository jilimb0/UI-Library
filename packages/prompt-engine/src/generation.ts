import { validateRequiredShape } from '@ui-construction-library/schema';
import { normalizePromptRequest, slugify } from './normalization';
import type {
  PromptDraftNode,
  PromptDraftProject,
  PromptRequest,
} from './types';

export const DETERMINISTIC_USED_COMPONENTS = [
  'card',
  'heading',
  'text',
] as const;

export type CompositionPlan = {
  compositionFamily:
    | 'hero-led'
    | 'feature-grid'
    | 'signal-first-dashboard'
    | 'campaign-focus'
    | 'form-driven-settings'
    | 'docs-structured'
    | 'pricing-tiered'
    | 'onboarding-linear';
  layoutRhythm: 'intro-heavy' | 'balanced-stack' | 'summary-detail';
  sectionPadding: 'sm' | 'md' | 'lg';
  heroShadow: 'sm' | 'md';
};

export function deriveCompositionPlan(request: PromptRequest): CompositionPlan {
  if (request.generationMode === 'dashboard') {
    return {
      compositionFamily: 'signal-first-dashboard',
      layoutRhythm: 'summary-detail',
      sectionPadding: request.density === 'compact' ? 'sm' : 'md',
      heroShadow: 'sm',
    };
  }

  if (request.generationMode === 'settings-app') {
    return {
      compositionFamily: 'form-driven-settings',
      layoutRhythm: 'balanced-stack',
      sectionPadding: 'md',
      heroShadow: 'sm',
    };
  }

  if (request.generationMode === 'docs-page') {
    return {
      compositionFamily: 'docs-structured',
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

  if (request.generationMode === 'pricing-page') {
    return {
      compositionFamily: 'pricing-tiered',
      layoutRhythm: 'balanced-stack',
      sectionPadding: request.density === 'compact' ? 'sm' : 'md',
      heroShadow: 'sm',
    };
  }

  if (request.generationMode === 'onboarding') {
    return {
      compositionFamily: 'onboarding-linear',
      layoutRhythm: 'intro-heavy',
      sectionPadding: request.density === 'spacious' ? 'lg' : 'md',
      heroShadow: 'sm',
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

export function makeTextNode(id: string, children: string): PromptDraftNode {
  return {
    id,
    componentId: 'text',
    props: { children, align: 'start' },
    children: [],
  };
}

export function makeHeadingNode(
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

  if (plan.compositionFamily === 'form-driven-settings') {
    return `Structured configuration panel for editing ${section} parameters.`;
  }

  if (plan.compositionFamily === 'docs-structured') {
    return `Reference guide page covering ${section} setup, installation, and APIs.`;
  }

  if (plan.compositionFamily === 'pricing-tiered') {
    return `Pricing scaffold for ${section} with deterministic plan hierarchy and clear upgrade path.`;
  }

  if (plan.compositionFamily === 'onboarding-linear') {
    return `Step ${index + 1} of the onboarding flow: ${section} setup with guided progression.`;
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
  } else if (
    section === 'profile' ||
    section === 'notifications' ||
    section === 'security'
  ) {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Governed form controls for updating ${section} settings with instant schema validation.`
      )
    );
  } else if (
    section === 'sidebar' ||
    section === 'anchors' ||
    section === 'examples'
  ) {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Anchor-supported technical documentation layout for ${section} reference.`
      )
    );
  } else if (
    section === 'plans' ||
    section === 'comparison' ||
    section === 'trust'
  ) {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Deterministic ${section} scaffold with clear tier hierarchy and conversion-safe layout.`
      )
    );
  } else if (
    section === 'welcome' ||
    section === 'setup' ||
    section === 'complete'
  ) {
    nodes.push(
      makeTextNode(
        `${baseId}-summary`,
        `Onboarding step: ${section} — linear progression with progress indicator and single primary action.`
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

export function buildLandingPageDraft(
  request: PromptRequest
): PromptDraftProject {
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

export function validatePromptDraftProject(draft: PromptDraftProject): boolean {
  return (
    validateRequiredShape('project', draft) &&
    draft.pages.every((page) => validateRequiredShape('layout', page.root))
  );
}
