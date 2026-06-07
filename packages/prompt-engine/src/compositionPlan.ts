/**
 * Composition plan derivation.
 *
 * Maps a PromptRequest onto a CompositionPlan that describes the visual
 * family, layout rhythm, section padding, and hero shadow for the draft.
 * Extracted from generation.ts for focused testing and reuse.
 */

import type { PromptRequest } from './types';

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

function densityPadding(
  density: PromptRequest['density'],
  opts: {
    compact?: 'sm' | 'md' | 'lg';
    spacious?: 'sm' | 'md' | 'lg';
    default?: 'sm' | 'md' | 'lg';
  } = {}
): 'sm' | 'md' | 'lg' {
  if (density === 'compact') return opts.compact ?? 'sm';
  if (density === 'spacious') return opts.spacious ?? 'lg';
  return opts.default ?? 'md';
}

export function deriveCompositionPlan(request: PromptRequest): CompositionPlan {
  switch (request.generationMode) {
    case 'dashboard':
      return {
        compositionFamily: 'signal-first-dashboard',
        layoutRhythm: 'summary-detail',
        sectionPadding: densityPadding(request.density, { spacious: 'md' }),
        heroShadow: 'sm',
      };

    case 'settings-app':
      return {
        compositionFamily: 'form-driven-settings',
        layoutRhythm: 'balanced-stack',
        sectionPadding: 'md',
        heroShadow: 'sm',
      };

    case 'docs-page':
      return {
        compositionFamily: 'docs-structured',
        layoutRhythm: 'summary-detail',
        sectionPadding: densityPadding(request.density, { spacious: 'md' }),
        heroShadow: 'sm',
      };

    case 'marketing-section':
      return {
        compositionFamily: 'campaign-focus',
        layoutRhythm: 'intro-heavy',
        sectionPadding: densityPadding(request.density, { compact: 'md' }),
        heroShadow: 'md',
      };

    case 'pricing-page':
      return {
        compositionFamily: 'pricing-tiered',
        layoutRhythm: 'balanced-stack',
        sectionPadding: densityPadding(request.density, { spacious: 'md' }),
        heroShadow: 'sm',
      };

    case 'onboarding':
      return {
        compositionFamily: 'onboarding-linear',
        layoutRhythm: 'intro-heavy',
        sectionPadding: densityPadding(request.density, { compact: 'md' }),
        heroShadow: 'sm',
      };

    default:
      // landing-page (and any unrecognised mode)
      if (
        request.sections.includes('features') ||
        request.sections.includes('pricing')
      ) {
        return {
          compositionFamily: 'feature-grid',
          layoutRhythm: 'balanced-stack',
          sectionPadding: densityPadding(request.density),
          heroShadow: 'md',
        };
      }
      return {
        compositionFamily: 'hero-led',
        layoutRhythm: 'intro-heavy',
        sectionPadding: densityPadding(request.density),
        heroShadow: 'md',
      };
  }
}
