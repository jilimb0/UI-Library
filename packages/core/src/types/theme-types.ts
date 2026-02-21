export interface ThemeColors {
  background: string;
  text: string;
  primary?: string;
  secondary?: string;
  success?: string;
  warning?: string;
  error?: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    thin: string;
    extralight: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
}

export interface ThemeSpacing {
  [key: number]: string; // e.g., 0: '0px', 1: '0.25rem'
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface AppTheme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  // Add other theme-related properties like shadows, breakpoints, etc.
}
