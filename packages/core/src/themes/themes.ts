import {
  colors,
  semanticDarkColors,
  semanticLightColors,
} from '@ui-lib/tokens';

type ColorScale = Record<
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  string
>;
type ColorTokens = {
  primary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  info: ColorScale;
};
type SemanticColors = Record<
  | 'background'
  | 'foreground'
  | 'muted'
  | 'border'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info',
  string
>;

export interface ThemeDefinition {
  mode: 'light' | 'dark';
  colors: ColorTokens;
  semantic: SemanticColors;
}

export const lightTheme: ThemeDefinition = {
  mode: 'light',
  colors,
  semantic: semanticLightColors,
};

export const darkTheme: ThemeDefinition = {
  mode: 'dark',
  colors,
  semantic: semanticDarkColors,
};
