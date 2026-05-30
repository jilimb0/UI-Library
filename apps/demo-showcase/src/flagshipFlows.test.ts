import { describe, expect, it } from 'vitest';
import { flagshipFlowAnchors, flagshipFlows } from './flagshipFlows';

describe('flagshipFlows', () => {
  it('defines the showcase flow catalog', () => {
    expect(flagshipFlows).toHaveLength(5);
    expect(flagshipFlows[0]).toMatchObject({
      id: 'saas-landing',
      name: 'SaaS landing page',
    });
    expect(flagshipFlows[0].exportedArtifact).toContain(
      'React single-page export'
    );
  });

  it('exposes the navigation anchors for the showcase sections', () => {
    expect(flagshipFlowAnchors).toEqual([
      { id: 'overview', label: 'Landing' },
      { id: 'components', label: 'Dashboard' },
      { id: 'integrations', label: 'Settings' },
      { id: 'hooks', label: 'Docs' },
      { id: 'flagship-flows', label: 'Pricing' },
    ]);
  });
});
