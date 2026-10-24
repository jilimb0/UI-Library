import {
  type ThemeContextValue,
  useTheme as useThemeContext,
} from './ThemeProvider';

export type { ThemeContextValue, ThemeProviderProps } from './ThemeProvider';

export const THEME_STORAGE_KEY = 'ucl-theme';

export function useTheme(): ThemeContextValue {
  return useThemeContext();
}

export default useTheme;
