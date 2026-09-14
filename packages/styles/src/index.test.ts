import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('ships the documented utility selectors (vanilla contract)', () => {
    const utilities = readFileSync(
      join(import.meta.dirname, './utilities.css'),
      'utf8'
    );
    for (const sel of [
      '.ucl-cluster--between',
      '.ucl-sticky-top',
      '.ucl-w-full',
      '.ucl-text-info',
      '.ucl-text-muted',
      '.ucl-truncate',
    ]) {
      expect(utilities).toContain(sel);
    }
  });

  it('ships the component variant selectors used by vanilla consumers', () => {
    const components = readFileSync(
      join(import.meta.dirname, '../../core/src/styles/components.css'),
      'utf8'
    );
    for (const sel of [
      '.button--success',
      '.button--warning',
      '.button--info',
      '.badge--info',
      '.alert--info',
      '.table--striped',
      '.table--compact',
      '.table-sticky-header',
    ]) {
      expect(components).toContain(sel);
    }
  });
});
