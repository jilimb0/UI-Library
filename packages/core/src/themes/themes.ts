/**
 * Theme constants for @ui-construction-library/core.
 * The canonical token source is packages/tokens/src/tokens.w3c.json.
 */

export type BuiltinTheme = 'light' | 'dark';
export const BUILTIN_THEMES = ['light', 'dark'] as const;

/**
 * @deprecated Use ThemeName from ThemeProvider instead.
 * Kept for backward-compat — resolves to string.
 */
export type ThemeMode = string;

/**
 * @deprecated Kept for compile-time compatibility.
 * Use ThemeProvider themes prop.
 */
export const lightTheme = { mode: 'light' as BuiltinTheme } as const;

/**
 * @deprecated Kept for compile-time compatibility.
 * Use ThemeProvider themes prop.
 */
export const darkTheme = { mode: 'dark' as BuiltinTheme } as const;

/** @deprecated Use BUILTIN_THEMES instead. */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;
