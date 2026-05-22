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

export const colors: ColorTokens = {
  primary: {
    50: '#eef9f8',
    100: '#d6f0ee',
    200: '#afe1dc',
    300: '#7fcac3',
    400: '#4faea8',
    500: '#1f8f8b',
    600: '#167471',
    700: '#105a58',
    800: '#0b4241',
    900: '#082c2c',
  },
  neutral: {
    50: '#f7f6f2',
    100: '#efede7',
    200: '#dfdcd3',
    300: '#c7c2b7',
    400: '#9d978c',
    500: '#746f66',
    600: '#5b564e',
    700: '#433f39',
    800: '#2e2b27',
    900: '#1d1b18',
  },
  success: {
    50: '#edf8ee',
    100: '#d5ecd8',
    200: '#acd9b2',
    300: '#7fc088',
    400: '#5ca364',
    500: '#437a22',
    600: '#35641a',
    700: '#274b13',
    800: '#1a340d',
    900: '#101f08',
  },
  error: {
    50: '#fbf0f5',
    100: '#f4d8e7',
    200: '#e8b0cf',
    300: '#d87fb0',
    400: '#c45492',
    500: '#a12c7b',
    600: '#831f62',
    700: '#66184c',
    800: '#491035',
    900: '#2e091f',
  },
  warning: {
    50: '#fdf3ea',
    100: '#f7ddca',
    200: '#eec09f',
    300: '#df9967',
    400: '#c76d38',
    500: '#964219',
    600: '#783515',
    700: '#5b280f',
    800: '#3f1b0a',
    900: '#261005',
  },
  info: {
    50: '#eef5fb',
    100: '#d8e7f4',
    200: '#b3cde8',
    300: '#83afd8',
    400: '#4b8fc2',
    500: '#006494',
    600: '#0b5177',
    700: '#0b3f5c',
    800: '#082e43',
    900: '#051c2a',
  },
};

export const semanticLightColors: SemanticColors = {
  background: colors.neutral[50],
  foreground: '#28251d',
  muted: '#f1efe9',
  border: colors.neutral[200],
  primary: colors.primary[500],
  secondary: colors.neutral[600],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  info: colors.info[500],
  card: '#fbfaf7',
  accent: '#ece9e2',
  popover: '#fffdf9',
  ring: colors.primary[400],
  input: colors.neutral[200],
};

export const semanticDarkColors: SemanticColors = {
  background: '#171614',
  foreground: '#ede9e1',
  muted: '#22201d',
  border: '#3a3732',
  primary: colors.primary[400],
  secondary: colors.neutral[300],
  success: '#6daa45',
  warning: '#bb653b',
  error: '#d163a7',
  info: '#5591c7',
  card: '#1d1b18',
  accent: '#26231f',
  popover: '#1f1c19',
  ring: colors.primary[300],
  input: '#3a3732',
};
