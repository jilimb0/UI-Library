import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  appendDoctorArtifacts,
  type BuilderLikeProject,
  createExportAssetManifest,
  createExportDoctorReport,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from './index';

const builderFixture: BuilderLikeProject = {
  id: 'builder-fixture',
  name: 'Marketing site',
  pages: [
    {
      id: 'home',
      title: 'Home',
      root: {
        id: 'root-home',
        componentId: 'stack',
        props: { gap: 'lg' },
        children: [
          {
            id: 'headline',
            componentId: 'text',
            props: { as: 'h1', children: 'Launch faster' },
            children: [],
          },
        ],
      },
    },
  ],
};

describe('export fidelity helpers', () => {
  it('creates asset manifests from rendered artifacts', () => {
    const normalized = normalizeExportProject(
      createExportRequestFromBuilderProject(builderFixture, 'react-single-page')
    );
    const enriched = enrichExportProject(analyzeExportProject(normalized));
    const rendered = renderExportProject(enriched);

    expect(createExportAssetManifest(enriched, rendered)).toEqual({
      fonts: ['src/theme.css'],
      icons: ['assets/icons/placeholder-app-icon.svg'],
      assets: ['assets/icons/placeholder-app-icon.svg'],
      tokens: ['tokens/design-tokens.css', 'tokens/design-tokens.json'],
      policy: {
        placeholderAssets: ['assets/icons/placeholder-app-icon.svg'],
        copiedAssets: [],
        unresolvedAssets: ['builder-node:root-home'],
        iconTransforms: [
          'assets/icons/placeholder-app-icon.svg -> placeholder-icon-transform',
        ],
        fontPolicies: [
          'shared-theme-stylesheet:@ui-construction-library/styles/styles.css',
          'shared-variables-stylesheet:@ui-construction-library/styles/styles.css',
          'font-manifest-missing',
        ],
      },
    });
  });

  it('creates doctor reports and appends doctor markdown artifacts', () => {
    const normalized = normalizeExportProject(
      createExportRequestFromBuilderProject(builderFixture, 'react-single-page')
    );
    const enriched = enrichExportProject(analyzeExportProject(normalized));
    const rendered = renderExportProject(enriched);
    const report = createExportDoctorReport(enriched, rendered);
    const withDoctor = appendDoctorArtifacts(enriched, rendered);

    expect(report.status).toBe('warn');
    expect(report.assetManifest.fonts).toEqual(['src/theme.css']);
    expect(report.assetManifest.tokens).toEqual([
      'tokens/design-tokens.css',
      'tokens/design-tokens.json',
    ]);
    expect(report.assetManifest.policy.placeholderAssets).toEqual([
      'assets/icons/placeholder-app-icon.svg',
    ]);
    expect(report.assetManifest.policy.unresolvedAssets).toEqual([
      'builder-node:root-home',
    ]);
    expect(report.recommendations).toContain(
      'Replace placeholder asset emissions with copied source assets or documented transforms before graduating export fidelity.'
    );
    expect(report.recommendations).toContain(
      'Resolve unsupported builder nodes or add explicit copy/degrade rules so asset handoff avoids unresolved placeholders.'
    );
    expect(withDoctor.files.map((file) => file.path)).toContain(
      'EXPORT_DOCTOR.md'
    );
    expect(withDoctor.files.map((file) => file.path)).toContain(
      'EXPORT_REPORT.json'
    );
    expect(
      withDoctor.files.find((file) => file.path === 'EXPORT_DOCTOR.md')?.content
    ).toContain('# Export doctor');
    expect(
      withDoctor.files.find((file) => file.path === 'EXPORT_DOCTOR.md')?.content
    ).toContain('Placeholder assets: assets/icons/placeholder-app-icon.svg');
    expect(
      withDoctor.files.find((file) => file.path === 'EXPORT_DOCTOR.md')?.content
    ).toContain('Unresolved assets: builder-node:root-home');
    expect(
      withDoctor.files.find((file) => file.path === 'EXPORT_REPORT.json')
        ?.content
    ).toContain('"placeholderAssets"');
  });
});
