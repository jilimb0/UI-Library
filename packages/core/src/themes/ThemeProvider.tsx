import { generateCSSVariables } from '@ui-construction-library/tokens';
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const THEME_STORAGE_KEY = 'ui-library-theme';
const THEME_STYLE_TAG_ID = 'ui-lib-theme-variables';

type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  defaultTheme?: ThemeMode;
  theme?: ThemeMode;
  customTokens?: {
    colors?: Record<string, Record<string, string>>;
    semantic?: Record<string, string>;
  };
  children: ReactNode;
}

function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
}

function getInitialTheme(defaultTheme: ThemeMode): ThemeMode {
  return getStoredTheme() ?? defaultTheme;
}

function ensureThemeStyleTag(): HTMLStyleElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let styleTag = document.getElementById(
    THEME_STYLE_TAG_ID
  ) as HTMLStyleElement | null;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = THEME_STYLE_TAG_ID;
    document.head.appendChild(styleTag);
  }

  return styleTag;
}

function applyThemeToDocument(
  theme: ThemeMode,
  customTokens?: ThemeProviderProps['customTokens']
) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', theme);

  const styleTag = ensureThemeStyleTag();
  if (!styleTag) {
    return;
  }

  styleTag.textContent = generateCSSVariables({
    mode: theme,
    ...customTokens,
  });
}

function persistTheme(theme: ThemeMode, isControlled: boolean) {
  if (typeof window === 'undefined' || isControlled) {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

const ThemeProvider: FC<ThemeProviderProps> = ({
  defaultTheme = 'light',
  theme: controlledTheme,
  customTokens,
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    getInitialTheme(defaultTheme)
  );

  const resolvedTheme = controlledTheme ?? theme;

  useEffect(() => {
    applyThemeToDocument(resolvedTheme, customTokens);
    persistTheme(resolvedTheme, Boolean(controlledTheme));
  }, [resolvedTheme, customTokens, controlledTheme]);

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
