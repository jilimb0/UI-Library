import { describe, expect, it } from 'vitest';
import {
  densityClassMap,
  globalStylesheetPath,
  stylesPath,
  themeStylesheetPath,
  variablesStylesheetPath,
} from './index';

describe('@ui-construction-library/styles', () => {
  it('exports stable stylesheet entrypoints', () => {
    expect(globalStylesheetPath).toBe(
      '@ui-construction-library/styles/styles.css'
    );
    expect(themeStylesheetPath).toBe(
      '@ui-construction-library/styles/styles.css'
    );
    expect(variablesStylesheetPath).toBe(
      '@ui-construction-library/styles/styles.css'
    );
    expect(stylesPath).toBe('@ui-construction-library/styles/styles.css');
  });

  it('maps density presets to classes', () => {
    expect(densityClassMap.comfortable).toBe('ui-density-comfortable');
    expect(densityClassMap.compact).toBe('ui-density-compact');
  });
});
