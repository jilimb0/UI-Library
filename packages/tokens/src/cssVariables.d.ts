import { type ColorTokens, type SemanticColors } from './colors';
export type ThemeName = 'light' | 'dark';
export interface Theme {
  mode?: ThemeName;
  colors?: Partial<ColorTokens>;
  semantic?: Partial<SemanticColors>;
  overrides?: Record<string, string>;
}
export declare function generateCSSVariables(theme?: Theme): string;
