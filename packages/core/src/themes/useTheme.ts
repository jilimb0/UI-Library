import {
  type ThemeContextValue,
  useTheme as useThemeContext,
} from './ThemeProvider';

export type { ThemeContextValue, ThemeProviderProps } from './ThemeProvider';
export type { ThemeDefinition } from './themes';

export const THEME_STORAGE_KEY = 'ui-library-theme';

export function useTheme(): ThemeContextValue {
  return useThemeContext();
}

export default useTheme;
