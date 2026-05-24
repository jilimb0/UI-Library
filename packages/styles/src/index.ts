export const globalStylesheetPath =
  '@ui-construction-library/styles/dist/global.css';
export const themeStylesheetPath =
  '@ui-construction-library/styles/dist/themes.css';
export const variablesStylesheetPath =
  '@ui-construction-library/styles/dist/variables.css';

export type DensityPreset = 'comfortable' | 'compact';

export const densityClassMap: Record<DensityPreset, string> = {
  comfortable: 'ui-density-comfortable',
  compact: 'ui-density-compact',
};
