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

export const NEUTRAL_CSS = `
[data-theme="neutral"] {
  --ucl-color-background: #fafaf9;
  --ucl-color-foreground: #1c1917;
  --ucl-color-card: #ffffff;
  --ucl-color-card-foreground: #1c1917;
  --ucl-color-popover: #ffffff;
  --ucl-color-popover-foreground: #1c1917;
  --ucl-color-muted: #f5f5f4;
  --ucl-color-muted-foreground: #78716c;
  --ucl-color-accent: #f5f5f4;
  --ucl-color-accent-foreground: #1c1917;
  --ucl-color-border: #e7e5e4;
  --ucl-color-input: #e7e5e4;
  --ucl-color-ring: #a8a29e;
  --ucl-color-primary: #57534e;
  --ucl-color-primary-foreground: #fafaf9;
  --ucl-color-secondary: #a8a29e;
  --ucl-color-secondary-foreground: #fafaf9;
  --ucl-color-success: #84cc16;
  --ucl-color-success-foreground: #fafaf9;
  --ucl-color-warning: #d97706;
  --ucl-color-warning-foreground: #fafaf9;
  --ucl-color-error: #ef4444;
  --ucl-color-error-foreground: #fafaf9;
  --ucl-color-info: #0ea5e9;
  --ucl-color-info-foreground: #fafaf9;
}
`;

export type ThemeName = string;

export interface BrandTokens {
  brand?: Record<string, Record<string, string>>;
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

/**
 * Validate and return a stored theme name only if it is a known
 * builtin ('light' | 'dark') or a key in the supplied custom themes
 * map. Rejects any unknown or corrupted value to prevent untrusted
 * strings from reaching data-theme attributes and CSS selectors.
 */
function getStoredTheme(
  customThemes?: Record<string, BrandTokens>
): ThemeName | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored) return null;
  const known =
    stored === 'light' ||
    stored === 'dark' ||
    stored === 'neutral' ||
    (customThemes !== undefined && Object.hasOwn(customThemes, stored));
  return known ? stored : null;
}

function getInitialTheme(
  defaultTheme: ThemeName,
  customThemes?: Record<string, BrandTokens>
): ThemeName {
  return getStoredTheme(customThemes) ?? defaultTheme;
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
  if (themeName === 'neutral') return NEUTRAL_CSS;
  const brandTokens = themes?.[themeName];
  if (brandTokens) {
    return generateThemeCSS({ name: themeName, ...brandTokens });
  }
  console.warn(
    `[UCL] ThemeProvider: unknown theme "${themeName}". ` +
      'Add it to the themes prop or use a builtin ' +
      '("light" | "dark" | "neutral"). Falling back to "light".'
  );
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
    getInitialTheme(defaultTheme, themes)
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
