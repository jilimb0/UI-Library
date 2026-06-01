import { borderRadius } from './borders';
import { colors, semanticDarkColors, semanticLightColors } from './colors';
import { motion } from './motion';
import { opacity } from './opacity';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

function toCSSVarLines(name, value) {
  return `  --${name}: ${value};`;
}
function toThemeLayer(name, lines) {
  return [`[data-theme="${name}"] {`, ...lines, '}'].join('\n');
}
function toThemeLayerForRoot(name, lines) {
  return [
    `:root:not([data-theme]), [data-theme="${name}"] {`,
    ...lines,
    '}',
  ].join('\n');
}
export function generateCSSVariables(theme = {}) {
  const mode = theme.mode ?? 'light';
  const mergedScales = {
    primary: { ...colors.primary, ...(theme.colors?.primary ?? {}) },
    neutral: { ...colors.neutral, ...(theme.colors?.neutral ?? {}) },
    success: { ...colors.success, ...(theme.colors?.success ?? {}) },
    error: { ...colors.error, ...(theme.colors?.error ?? {}) },
    warning: { ...colors.warning, ...(theme.colors?.warning ?? {}) },
    info: { ...colors.info, ...(theme.colors?.info ?? {}) },
  };
  const semanticBase =
    mode === 'dark' ? semanticDarkColors : semanticLightColors;
  const semantic = { ...semanticBase, ...(theme.semantic ?? {}) };
  const rootLines = [];
  Object.keys(mergedScales).forEach((scaleName) => {
    const scale = mergedScales[scaleName];
    Object.entries(scale).forEach(([tone, value]) => {
      rootLines.push(
        toCSSVarLines(`color-${String(scaleName)}-${tone}`, value)
      );
    });
  });
  Object.keys(semantic).forEach((semanticName) => {
    const semanticValue = semantic[semanticName];
    rootLines.push(
      toCSSVarLines(`color-${String(semanticName)}`, semanticValue)
    );
    rootLines.push(toCSSVarLines(String(semanticName), semanticValue));
  });
  Object.entries(spacing).forEach(([k, value]) => {
    const safeKey = k.replace('.', '-');
    rootLines.push(toCSSVarLines(`space-${safeKey}`, value));
    rootLines.push(toCSSVarLines(`spacing-${safeKey}`, value));
  });
  Object.entries(typography.fontFamily).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`font-${k}`, value));
  });
  Object.entries(typography.fontSize).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`text-${k}`, value));
    rootLines.push(toCSSVarLines(`font-size-${k}`, value));
  });
  Object.entries(typography.lineHeight).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`line-height-${k}`, value));
  });
  Object.entries(typography.letterSpacing).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`tracking-${k}`, value));
  });
  Object.entries(typography.fontWeight).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`font-weight-${k}`, value));
  });
  Object.keys(motion.duration).forEach((k) => {
    rootLines.push(
      toCSSVarLines(`motion-duration-${String(k)}`, motion.duration[k])
    );
  });
  Object.keys(motion.easing).forEach((k) => {
    rootLines.push(
      toCSSVarLines(`motion-easing-${String(k)}`, motion.easing[k])
    );
  });
  Object.entries(opacity).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`opacity-${k}`, value));
  });
  Object.entries(borderRadius).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`radius-${k}`, value));
  });
  Object.entries(shadows).forEach(([k, value]) => {
    rootLines.push(toCSSVarLines(`shadow-${k}`, value));
  });
  const overrideLines = Object.entries(theme.overrides ?? {}).map(([k, v]) =>
    toCSSVarLines(k.startsWith('--') ? k.slice(2) : k, v)
  );
  return [
    toThemeLayerForRoot('light', rootLines),
    toThemeLayer('light', overrideLines),
    toThemeLayerForRoot('dark', rootLines),
    toThemeLayer('dark', overrideLines),
  ].join('\n\n');
}
