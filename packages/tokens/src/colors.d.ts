export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};
export type SemanticColors = {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  card: string;
  accent: string;
  popover: string;
  ring: string;
  input: string;
};
export interface ColorTokens {
  primary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  info: ColorScale;
}
export declare const colors: ColorTokens;
export declare const semanticLightColors: SemanticColors;
export declare const semanticDarkColors: SemanticColors;
