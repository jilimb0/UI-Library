import {
  colors,
  semanticDarkColors,
  semanticLightColors,
} from '@ui-construction-library/tokens';

export type ThemeMode = 'light' | 'dark';
export type LibraryThemeColors = typeof colors;
export type LibraryThemeSemantic = typeof semanticLightColors;

export interface ThemeDefinition {
  mode: ThemeMode;
  colors: LibraryThemeColors;
  semantic: LibraryThemeSemantic;
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

export const themes: Record<ThemeMode, ThemeDefinition> = {
  light: lightTheme,
  dark: darkTheme,
};
