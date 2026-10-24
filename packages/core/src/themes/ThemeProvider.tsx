import {
  DARK_CSS,
  generateThemeCSS,
  LIGHT_CSS,
} from '@ui-construction-library/tokens';
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const THEME_STORAGE_KEY = 'ucl-theme';
const THEME_STYLE_TAG_ID = 'ucl-theme';

export type ThemeName = string;

export interface BrandTokens {
  semantic?: Record<string, string>;
  component?: Record<string, Record<string, string>>;
}

export interface ThemeProviderProps {
  defaultTheme?: ThemeName;
  theme?: ThemeName;
  themes?: Record<string, BrandTokens>;
  children: ReactNode;
}

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): ThemeName | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored ?? null;
}

function getInitialTheme(defaultTheme: ThemeName): ThemeName {
  return getStoredTheme() ?? defaultTheme;
}

function ensureThemeStyleTag(): HTMLStyleElement | null {
  if (typeof document === 'undefined') {
    return null;
  }
  let tag = document.getElementById(
    THEME_STYLE_TAG_ID
  ) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = THEME_STYLE_TAG_ID;
    document.head.appendChild(tag);
  }
  return tag;
}

function resolveThemeCSS(
  themeName: ThemeName,
  themes?: Record<string, BrandTokens>
): string {
  if (themeName === 'light') return LIGHT_CSS;
  if (themeName === 'dark') return DARK_CSS;
  const brandTokens = themes?.[themeName];
  if (brandTokens) {
    return generateThemeCSS({ name: themeName, ...brandTokens });
  }
  return LIGHT_CSS;
}

function applyThemeToDocument(
  theme: ThemeName,
  themes?: Record<string, BrandTokens>
): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.setAttribute('data-theme', theme);
  const tag = ensureThemeStyleTag();
  if (!tag) {
    return;
  }
  tag.textContent = resolveThemeCSS(theme, themes);
}

function persistTheme(theme: ThemeName, isControlled: boolean): void {
  if (typeof window === 'undefined' || isControlled) {
    return;
  }
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

const ThemeProvider: FC<ThemeProviderProps> = ({
  defaultTheme = 'light',
  theme: controlledTheme,
  themes,
  children,
}) => {
  const [theme, setTheme] = useState<ThemeName>(() =>
    getInitialTheme(defaultTheme)
  );

  const resolvedTheme = controlledTheme ?? theme;

  useEffect(() => {
    applyThemeToDocument(resolvedTheme, themes);
    persistTheme(resolvedTheme, Boolean(controlledTheme));
  }, [resolvedTheme, themes, controlledTheme]);

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
