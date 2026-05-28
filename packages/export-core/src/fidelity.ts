import {
  themeStylesheetPath,
  variablesStylesheetPath,
} from '@ui-construction-library/styles';
import {
  generateCSSVariables,
  typography,
} from '@ui-construction-library/tokens';
import type {
  EnrichExportResult,
  ExportDiagnostic,
  ExportFile,
  ExportTarget,
  RenderExportResult,
} from './index';

export type ExportAssetPolicy = {
  placeholderAssets: string[];
  copiedAssets: string[];
  unresolvedAssets: string[];
  iconTransforms: string[];
  fontPolicies: string[];
};

export type ExportAssetManifest = {
  fonts: string[];
  icons: string[];
  assets: string[];
  tokens: string[];
  policy: ExportAssetPolicy;
};

export type ExportDoctorReport = {
  target: ExportTarget;
  status: 'pass' | 'warn';
  assetManifest: ExportAssetManifest;
  diagnostics: ExportDiagnostic[];
  recommendations: string[];
};

export function createDesignTokenArtifactFiles(): ExportFile[] {
  const sharedThemeLayer = generateCSSVariables();
  const exportOverrideLayer = generateCSSVariables({
    overrides: {
      '--export-font-sans': typography.fontFamily.sans,
      '--export-font-serif': typography.fontFamily.serif,
      '--export-font-mono': typography.fontFamily.mono,
    },
  });

  return [
    {
      path: 'tokens/design-tokens.json',
      content: `${JSON.stringify(
        {
          typography: {
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize,
          },
          stylesheets: {
            theme: themeStylesheetPath,
            variables: variablesStylesheetPath,
          },
        },
        null,
        2
      )}\n`,
    },
    {
      path: 'tokens/design-tokens.css',
      content: `${sharedThemeLayer}\n\n/* export overrides */\n${exportOverrideLayer}\n`,
    },
    {
      path: 'assets/icons/placeholder-app-icon.svg',
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="48" height="48" rx="14" fill="#0f766e"/><path d="M22 32h20" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M32 22v20" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>\n',
    },
  ];
}

export function createExportAssetManifest(
  enriched: EnrichExportResult,
  rendered: RenderExportResult
): ExportAssetManifest {
  const filePaths = rendered.files.map((file) => file.path);

  const fonts = filePaths.filter(
    (path) => /(^|\/)(fonts?|theme)\//.test(path) || /font/i.test(path)
  );
  const icons = filePaths.filter((path) => /icon/i.test(path));
  const assets = filePaths.filter((path) =>
    /\.(png|svg|jpg|jpeg|webp|gif|woff2|woff|ttf)$/i.test(path)
  );
  const tokens = filePaths.filter((path) =>
    /design-tokens\.(json|css)$/i.test(path)
  );

  const themeFallback = rendered.files.some(
    (file) => file.path === 'src/theme.css'
  )
    ? ['src/theme.css']
    : [];

  const placeholderAssets = assets.filter((path) => /placeholder/i.test(path));
  const copiedAssets = assets.filter((path) => !/placeholder/i.test(path));
  const unresolvedAssets = enriched.unsupportedNodeIds.map(
    (nodeId) => `builder-node:${nodeId}`
  );
  const iconTransforms = icons.map((path) =>
    /placeholder/i.test(path)
      ? `${path} -> placeholder-icon-transform`
      : `${path} -> copied-icon-asset`
  );
  const fontPolicies = [
    `shared-theme-stylesheet:${themeStylesheetPath}`,
    `shared-variables-stylesheet:${variablesStylesheetPath}`,
    fonts.length > 0 ? 'font-manifest-present' : 'font-manifest-missing',
  ];

  return {
    fonts: [...new Set([...fonts, ...themeFallback])].sort(),
    icons: [...new Set(icons)].sort(),
    assets: [...new Set(assets)].sort(),
    tokens: [...new Set(tokens)].sort(),
    policy: {
      placeholderAssets: [...new Set(placeholderAssets)].sort(),
      copiedAssets: [...new Set(copiedAssets)].sort(),
      unresolvedAssets: [...new Set(unresolvedAssets)].sort(),
      iconTransforms: [...new Set(iconTransforms)].sort(),
      fontPolicies,
    },
  };
}

export function createExportDoctorReport(
  enriched: EnrichExportResult,
  rendered: RenderExportResult
): ExportDoctorReport {
  const assetManifest = createExportAssetManifest(enriched, rendered);
  const recommendations = new Set<string>();

  if (assetManifest.fonts.length === 0) {
    recommendations.add(
      'Add a shared theme or font manifest so exported targets carry explicit typography tokens.'
    );
  }

  if (assetManifest.icons.length === 0) {
    recommendations.add(
      'Add explicit icon asset emission or icon manifest support for richer handoff fidelity.'
    );
  }

  if (assetManifest.tokens.length === 0) {
    recommendations.add(
      'Emit design token artifacts so downstream targets can audit typography and theme inputs.'
    );
  }

  if (assetManifest.assets.length === 0) {
    recommendations.add(
      'Add asset file emission for images, fonts, and binary handoff artifacts before target graduation.'
    );
  }

  if (assetManifest.policy.unresolvedAssets.length > 0) {
    recommendations.add(
      'Resolve unsupported builder nodes or add explicit copy/degrade rules so asset handoff avoids unresolved placeholders.'
    );
  }

  if (assetManifest.policy.placeholderAssets.length > 0) {
    recommendations.add(
      'Replace placeholder asset emissions with copied source assets or documented transforms before graduating export fidelity.'
    );
  }

  if (rendered.diagnostics.some((diagnostic) => diagnostic.level === 'error')) {
    recommendations.add(
      'Resolve export errors before treating this output as a production-ready handoff artifact.'
    );
  }

  if (enriched.unsupportedNodeIds.length > 0) {
    recommendations.add(
      'Reduce unsupported nodes or add degraded-render explanations to improve export confidence.'
    );
  }

  return {
    target: enriched.ir.target,
    status: recommendations.size === 0 ? 'pass' : 'warn',
    assetManifest,
    diagnostics: rendered.diagnostics,
    recommendations: [...recommendations],
  };
}

export function createExportDoctorMarkdown(report: ExportDoctorReport): string {
  const diagnostics = report.diagnostics.length
    ? report.diagnostics
        .map(
          (diagnostic) =>
            `- [${diagnostic.level}] ${diagnostic.code}: ${diagnostic.message}`
        )
        .join('\n')
    : '- No runtime render diagnostics.';

  const recommendations = report.recommendations.length
    ? report.recommendations.map((item) => `- ${item}`).join('\n')
    : '- No doctor follow-up required.';

  return [
    `# Export doctor`,
    '',
    `- Target: ${report.target}`,
    `- Status: ${report.status}`,
    `- Font/theme assets: ${report.assetManifest.fonts.join(', ') || 'none'}`,
    `- Icon assets: ${report.assetManifest.icons.join(', ') || 'none'}`,
    `- Binary/static assets: ${report.assetManifest.assets.join(', ') || 'none'}`,
    `- Design token assets: ${report.assetManifest.tokens.join(', ') || 'none'}`,
    `- Placeholder assets: ${report.assetManifest.policy.placeholderAssets.join(', ') || 'none'}`,
    `- Copied assets: ${report.assetManifest.policy.copiedAssets.join(', ') || 'none'}`,
    `- Unresolved assets: ${report.assetManifest.policy.unresolvedAssets.join(', ') || 'none'}`,
    '',
    '## Font policies',
    report.assetManifest.policy.fontPolicies.length
      ? report.assetManifest.policy.fontPolicies
          .map((item) => `- ${item}`)
          .join('\n')
      : '- No font policies recorded.',
    '',
    '## Icon transforms',
    report.assetManifest.policy.iconTransforms.length
      ? report.assetManifest.policy.iconTransforms
          .map((item) => `- ${item}`)
          .join('\n')
      : '- No icon transforms recorded.',
    '',
    '## Diagnostics',
    diagnostics,
    '',
    '## Recommendations',
    recommendations,
    '',
  ].join('\n');
}

export function appendDoctorArtifacts(
  enriched: EnrichExportResult,
  rendered: RenderExportResult
): RenderExportResult {
  const report = createExportDoctorReport(enriched, rendered);
  const doctorFile: ExportFile = {
    path: 'EXPORT_DOCTOR.md',
    content: createExportDoctorMarkdown(report),
  };
  const reportFile: ExportFile = {
    path: 'EXPORT_REPORT.json',
    content: `${JSON.stringify(report, null, 2)}\n`,
  };

  return {
    files: [...rendered.files, doctorFile, reportFile],
    diagnostics: rendered.diagnostics,
  };
}
