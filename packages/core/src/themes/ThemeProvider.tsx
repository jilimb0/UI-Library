import { generateCSSVariables } from '@ui-lib/tokens';
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  defaultTheme?: 'light' | 'dark';
  theme?: 'light' | 'dark';
  customTokens?: {
    colors?: Record<string, Record<string, string>>;
    semantic?: Record<string, string>;
  };
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({
  defaultTheme = 'light',
  theme: controlledTheme,
  customTokens,
  children,
}) => {
  const [theme, setTheme] = useState(defaultTheme);
  const resolvedTheme = controlledTheme ?? theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    const cssVariables = generateCSSVariables({
      mode: resolvedTheme,
      ...customTokens,
    });
    const styleTagId = 'ui-lib-theme-variables';
    let styleTag = document.getElementById(
      styleTagId
    ) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleTagId;
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = cssVariables;
  }, [resolvedTheme, customTokens]);

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
