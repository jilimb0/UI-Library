export const globalStylesheetPath =
  '@ui-construction-library/styles/styles.css';
export const themeStylesheetPath = '@ui-construction-library/styles/styles.css';
export const variablesStylesheetPath =
  '@ui-construction-library/styles/styles.css';
/** Canonical stylesheet containing base + components + utilities with ucl- prefix */
export const stylesPath = '@ui-construction-library/styles/styles.css';

export const densityClassMap = {
  comfortable: 'ui-density-comfortable',
  compact: 'ui-density-compact',
} as const;

export type DensityPreset = keyof typeof densityClassMap;
