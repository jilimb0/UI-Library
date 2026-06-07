/**
 * Section node builders.
 *
 * Responsible for converting a (section, index, CompositionPlan) tuple into
 * the concrete PromptDraftNode children that populate a draft page section.
 * Extracted from generation.ts for focused testing and reuse.
 */

import type { CompositionPlan } from './compositionPlan';
import type { PromptDraftNode, PromptRequest } from './types';

// ── Primitive node factories ────────────────────────────────────────────────

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

// ── Section copy ─────────────────────────────────────────────────────────────

export function makeSectionCopy(
  request: PromptRequest,
  section: string,
  index: number,
  plan: CompositionPlan
): string {
  if (index === 0) {
    return `A ${request.styleTone} ${request.domain} experience generated for ${request.targetAudience} with a ${plan.layoutRhythm} rhythm.`;
  }

  switch (plan.compositionFamily) {
    case 'signal-first-dashboard':
      return `Summary-first ${section} block for ${request.targetAudience}, tuned to ${request.density} information density.`;
    case 'campaign-focus':
      return `Campaign-style ${section} content with deterministic hierarchy and ${request.styleTone} emphasis.`;
    case 'form-driven-settings':
      return `Structured configuration panel for editing ${section} parameters.`;
    case 'docs-structured':
      return `Reference guide page covering ${section} setup, installation, and APIs.`;
    case 'pricing-tiered':
      return `Pricing scaffold for ${section} with deterministic plan hierarchy and clear upgrade path.`;
    case 'onboarding-linear':
      return `Step ${index + 1} of the onboarding flow: ${section} setup with guided progression.`;
    default:
      return `Deterministic ${section} content for a ${request.styleTone} ${request.productType} concept.`;
  }
}

// ── Section summary node (semantic third child) ──────────────────────────────

function makeSummaryCopy(
  section: string,
  _index: number,
  request: PromptRequest
): string | null {
  if (
    section === 'metrics' ||
    section === 'analytics' ||
    section === 'activity'
  ) {
    return `Key signals, KPI deltas, and operational summaries for ${request.targetAudience}.`;
  }
  if (section === 'pricing' || section === 'plans') {
    return 'Plan comparison scaffold with deterministic billing hierarchy and clear upgrade path.';
  }
  if (section === 'faq' || section === 'docs' || section === 'setup') {
    return 'Reference-oriented section with concise onboarding detail and implementation guidance.';
  }
  if (section === 'cta') {
    return 'Single conversion-focused action area with restrained hierarchy and explicit next step.';
  }
  if (
    section === 'profile' ||
    section === 'notifications' ||
    section === 'security'
  ) {
    return `Governed form controls for updating ${section} settings with instant schema validation.`;
  }
  if (
    section === 'sidebar' ||
    section === 'anchors' ||
    section === 'examples'
  ) {
    return `Anchor-supported technical documentation layout for ${section} reference.`;
  }
  if (section === 'comparison' || section === 'trust') {
    return `Deterministic ${section} scaffold with clear tier hierarchy and conversion-safe layout.`;
  }
  if (section === 'welcome' || section === 'complete') {
    return `Onboarding step: ${section} — linear progression with progress indicator and single primary action.`;
  }
  return null;
}

// ── Section children assembly ─────────────────────────────────────────────────

export function makeSectionChildren(
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

  const summaryCopy = makeSummaryCopy(section, index, request);
  if (summaryCopy !== null) {
    nodes.push(makeTextNode(`${baseId}-summary`, summaryCopy));
  }

  return nodes;
}

// ── Layout variant ────────────────────────────────────────────────────────────

export function getSectionLayoutVariant(
  section: string,
  index: number,
  plan: CompositionPlan
): 'hero' | 'feature' | 'detail' | 'cta' {
  if (index === 0) return 'hero';
  if (section === 'cta' || section === 'pricing') return 'cta';
  if (plan.compositionFamily === 'signal-first-dashboard') return 'detail';
  return 'feature';
}
