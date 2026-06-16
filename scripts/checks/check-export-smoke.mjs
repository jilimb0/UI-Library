import {
  analyzeExportProject,
  appendDoctorArtifacts,
  createExportAcceptanceChecklist,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '@ui-construction-library/export-core';

const fixture = {
  id: 'smoke-builder-project',
  name: 'Smoke Export Demo',
  pages: [
    {
      id: 'home',
      title: 'Home',
      path: '/',
      root: {
        id: 'root-home',
        componentId: 'stack',
        props: { gap: 'lg' },
        children: [
          {
            id: 'hero-title',
            componentId: 'text',
            props: { as: 'h1', children: 'Export smoke check' },
            children: [],
          },
          {
            id: 'hero-copy',
            componentId: 'text',
            props: { as: 'p', children: 'Representative generated export for CI smoke coverage.' },
            children: [],
          },
        ],
      },
    },
    {
      id: 'pricing',
      title: 'Pricing',
      path: '/pricing',
      root: {
        id: 'root-pricing',
        componentId: 'stack',
        props: { gap: 'md' },
        children: [
          {
            id: 'pricing-title',
            componentId: 'text',
            props: { as: 'h2', children: 'Pricing plans' },
            children: [],
          },
        ],
      },
    },
  ],
};

function runForTarget(target) {
  const normalized = normalizeExportProject(
    createExportRequestFromBuilderProject(fixture, target)
  );
  const analyzed = analyzeExportProject(normalized);
  const enriched = enrichExportProject(analyzed);
  const rendered = renderExportProject(enriched);
  const withDoctor = appendDoctorArtifacts(enriched, rendered);
  const checklist = createExportAcceptanceChecklist(enriched, withDoctor);

  if (!checklist.hasPages || !checklist.deterministicRenderer || !checklist.builderFixtureCompatible) {
    throw new Error(`Export smoke failed for ${target}: ${JSON.stringify(checklist)}`);
  }

  const filePaths = withDoctor.files.map((file) => file.path);
  const required = ['README.md', 'EXPORT_DOCTOR.md'];
  for (const path of required) {
    if (!filePaths.includes(path)) {
      throw new Error(`Export smoke failed for ${target}: missing ${path}`);
    }
  }

  if (target.startsWith('react')) {
    for (const path of ['tokens/design-tokens.json', 'tokens/design-tokens.css']) {
      if (!filePaths.includes(path)) {
        throw new Error(`Export smoke failed for ${target}: missing ${path}`);
      }
    }
  }

  return {
    target,
    files: filePaths.length,
    diagnostics: withDoctor.diagnostics.length,
  };
}

// react-multi-page renderer is not yet implemented (falls through to default
// in pipeline.ts switch) — smoke only covers implemented targets.
const targets = ['react-single-page'];
const results = targets.map(runForTarget);
console.log(JSON.stringify({ ok: true, results }, null, 2));
