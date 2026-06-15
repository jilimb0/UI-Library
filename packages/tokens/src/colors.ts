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
  intent: {
    success: { bg: string; fg: string; border: string };
    error: { bg: string; fg: string; border: string };
    warning: { bg: string; fg: string; border: string };
    info: { bg: string; fg: string; border: string };
  };
};

export interface ColorTokens {
  primary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  info: ColorScale;
}

export const colors: ColorTokens = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
};

export const semanticLightColors: SemanticColors = {
  background: '#ffffff',
  foreground: '#09090b',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
  border: '#e4e4e7',
  primary: '#7c3aed',
  secondary: '#71717a',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  card: '#ffffff',
  accent: '#f4f4f5',
  popover: '#ffffff',
  ring: '#7c3aed',
  input: '#e4e4e7',
  intent: {
    success: { bg: '#ecfdf5', fg: '#065f46', border: '#a7f3d0' },
    error: { bg: '#fef2f2', fg: '#991b1b', border: '#fecaca' },
    warning: { bg: '#fffbeb', fg: '#92400e', border: '#fde68a' },
    info: { bg: '#eff6ff', fg: '#1e40af', border: '#bfdbfe' },
  },
};

export const semanticDarkColors: SemanticColors = {
  background: '#09090b',
  foreground: '#fafafa',
  muted: '#18181b',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
  primary: '#a78bfa',
  secondary: '#a1a1aa',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  card: '#09090b',
  accent: '#18181b',
  popover: '#09090b',
  ring: '#a78bfa',
  input: '#27272a',
  intent: {
    success: { bg: '#064e3b', fg: '#a7f3d0', border: '#065f46' },
    error: { bg: '#7f1d1d', fg: '#fecaca', border: '#991b1b' },
    warning: { bg: '#78350f', fg: '#fde68a', border: '#92400e' },
    info: { bg: '#1e3a8a', fg: '#bfdbfe', border: '#1e40af' },
  },
};
