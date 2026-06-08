/**
 * Aggregated raw token objects for multi-format export.
 *
 * This module collects all primitive, semantic, and component tokens
 * into single objects that can be serialized to JSON or consumed
 * directly by build tools (Figma plugins, Style Dictionary, etc.).
 */

import { borderRadius } from './borders';
import { breakpoints } from './breakpoints';
import { colors, semanticDarkColors, semanticLightColors } from './colors';
import { componentDarkTokens, componentLightTokens } from './componentTokens';
import { motion } from './motion';
import { opacity } from './opacity';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { transitions } from './transitions';
import { typography } from './typography';
import { zIndex } from './z-index';

// ---------------------------------------------------------------------------
// Primitive tokens (Tier 1) — framework-agnostic design vocabulary
// ---------------------------------------------------------------------------

export const rawTokens = {
  color: {
    primary: colors.primary,
    neutral: colors.neutral,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  },
  space: spacing,
  radius: borderRadius,
  shadow: shadows,
  font: {
    family: typography.fontFamily,
    size: typography.fontSize,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    weight: typography.fontWeight,
  },
  motion: {
    duration: motion.duration,
    easing: motion.easing,
  },
  opacity,
  'z-index': zIndex,
  breakpoints,
  transitions,
} as const;

// ---------------------------------------------------------------------------
// Semantic tokens (Tier 2) — light and dark themes
// ---------------------------------------------------------------------------

export const semanticTokens = {
  light: semanticLightColors,
  dark: semanticDarkColors,
} as const;

// ---------------------------------------------------------------------------
// Component tokens (Tier 3) — light and dark themes
// ---------------------------------------------------------------------------

export const componentTokens = {
  light: componentLightTokens,
  dark: componentDarkTokens,
} as const;
