import {
  type ColorTokens,
  colors,
  type SemanticColors,
  semanticDarkColors,
  semanticLightColors,
} from './colors';
import { motion } from './motion';
import { opacity } from './opacity';

export type ThemeName = 'light' | 'dark';

export interface Theme {
  mode?: ThemeName;
  colors?: Partial<ColorTokens>;
  semantic?: Partial<SemanticColors>;
}

function toCSSVarLines(name: string, value: string): string {
  return `  --${name}: ${value};`;
}

export function generateCSSVariables(theme: Theme = {}): string {
  const mode = theme.mode ?? 'light';
  const mergedScales: ColorTokens = {
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

  const lines: string[] = [':root {'];

  (Object.keys(mergedScales) as Array<keyof ColorTokens>).forEach(
    (scaleName) => {
      const scale = mergedScales[scaleName];
      Object.entries(scale).forEach(([tone, value]) => {
        lines.push(toCSSVarLines(`color-${String(scaleName)}-${tone}`, value));
      });
    }
  );

  (Object.keys(semantic) as Array<keyof SemanticColors>).forEach(
    (semanticName) => {
      lines.push(
        toCSSVarLines(`color-${String(semanticName)}`, semantic[semanticName])
      );
    }
  );

  (Object.keys(motion.duration) as Array<keyof typeof motion.duration>).forEach(
    (k) => {
      lines.push(
        toCSSVarLines(`motion-duration-${String(k)}`, motion.duration[k])
      );
    }
  );

  (Object.keys(motion.easing) as Array<keyof typeof motion.easing>).forEach(
    (k) => {
      lines.push(toCSSVarLines(`motion-easing-${String(k)}`, motion.easing[k]));
    }
  );

  Object.entries(opacity).forEach(([k, value]) => {
    lines.push(toCSSVarLines(`opacity-${k}`, value));
  });

  lines.push('}');
  return lines.join('\n');
}
