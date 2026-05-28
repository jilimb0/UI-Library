export type FlagshipFlow = {
  id: string;
  name: string;
  audience: string;
  promptInput: string;
  builderState: string;
  exportedArtifact: string;
  runnableDemo: string;
  proofPoints: string[];
};

export const flagshipFlows: FlagshipFlow[] = [
  {
    id: 'saas-landing',
    name: 'SaaS landing page',
    audience: 'Growth and marketing teams',
    promptInput:
      'Build a conversion-focused landing page for a B2B analytics product with a clear hero, social proof, pricing teaser, and trial CTA.',
    builderState:
      'Generate mode uses a structured hero, proof strip, and CTA stack with section-level regeneration for copy or layout changes.',
    exportedArtifact:
      'React single-page export with a route-aware shell, shared theme layer, and deterministic design tokens.',
    runnableDemo:
      'Live in the showcase hero and architecture sections as a ready-to-present acquisition surface.',
    proofPoints: ['hero clarity', 'pricing teaser', 'trial CTA'],
  },
  {
    id: 'dashboard-shell',
    name: 'Dashboard shell',
    audience: 'Product and operations teams',
    promptInput:
      'Create an admin dashboard with KPI cards, dense tables, quick filters, and a safe edit workflow for high-volume operations.',
    builderState:
      'Edit mode leans on tree operations, inspector editing, and batch-safe interactions for dashboard-scale changes.',
    exportedArtifact:
      'Route-backed app shell export with table, theme, and layout primitives ready for operational data views.',
    runnableDemo:
      'Shown through the data-heavy component gallery and live table interactions.',
    proofPoints: ['KPI blocks', 'table density', 'batch editing'],
  },
  {
    id: 'settings-app',
    name: 'Settings app',
    audience: 'SaaS product teams',
    promptInput:
      'Generate an account settings experience with profile editing, notification preferences, security toggles, and validation feedback.',
    builderState:
      'Review mode keeps manual edits protected while comments, versioning, and validation explain each risky change.',
    exportedArtifact:
      'Form-driven React or HTML export with typed state, accessible controls, and deterministic handoff artifacts.',
    runnableDemo:
      'Presented through the form integration surface and the modal-based interaction examples.',
    proofPoints: ['forms', 'validation', 'protected edits'],
  },
  {
    id: 'docs-page',
    name: 'Docs page',
    audience: 'Developer experience and docs teams',
    promptInput:
      'Lay out a docs page with a sticky sidebar, section anchors, code examples, and clear callouts for a public API surface.',
    builderState:
      'Review and publish modes expose the same page structure, making docs approval and regeneration deterministic.',
    exportedArtifact:
      'Multi-page export with route structure, shared theme layer, and stable page layouts for documentation sites.',
    runnableDemo:
      'Reflected by the architecture, integrations, and hooks sections in the showcase itself.',
    proofPoints: ['anchors', 'code blocks', 'publish review'],
  },
  {
    id: 'pricing-site',
    name: 'Pricing site',
    audience: 'Founders and sales-led teams',
    promptInput:
      'Design a pricing page with clear plan tiers, risk-reversal language, comparison logic, and a trustworthy release-ready finish.',
    builderState:
      'Publish mode combines role gating, version selection, and publish history before the release is considered safe.',
    exportedArtifact:
      'Deterministic static or React export with pricing sections, theme tokens, and supportable asset handling.',
    runnableDemo:
      'Anchored by the theme playground and the polished hero surface that can be reused for a launch page.',
    proofPoints: ['plan tiers', 'comparison logic', 'release gate'],
  },
];

export const flagshipFlowAnchors = [
  { id: 'overview', label: 'Landing' },
  { id: 'components', label: 'Dashboard' },
  { id: 'integrations', label: 'Settings' },
  { id: 'hooks', label: 'Docs' },
  { id: 'flagship-flows', label: 'Pricing' },
] as const;
