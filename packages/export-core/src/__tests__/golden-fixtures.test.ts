import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  type ExportRequest,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '../index';

describe('Export Golden Fixtures', () => {
  const targets: Array<
    'react-single-page' | 'html-static' | 'web-components-static'
  > = ['react-single-page', 'html-static', 'web-components-static'];

  const fixtures: Record<string, ExportRequest['project']> = {
    'landing-page': {
      id: 'landing-page-golden',
      name: 'Analytics Landing Page',
      pages: [
        {
          id: 'home',
          name: 'Home',
          path: '/',
          rootNode: {
            id: 'card-1',
            componentId: 'card',
            props: { padding: 'lg', interactive: false },
            children: [
              {
                id: 'heading-1',
                componentId: 'heading',
                props: { level: '1', children: 'Next-gen Analytics Platform' },
                children: [],
              },
              {
                id: 'text-1',
                componentId: 'text',
                props: {
                  children:
                    'Unlock deeper insights with real-time operational query engines.',
                },
                children: [],
              },
            ],
          },
        },
      ],
    },
    'dashboard-shell': {
      id: 'dashboard-golden',
      name: 'Operational Dashboard',
      pages: [
        {
          id: 'metrics',
          name: 'Metrics',
          path: '/',
          rootNode: {
            id: 'card-root',
            componentId: 'card',
            props: { padding: 'md' },
            children: [
              {
                id: 'head',
                componentId: 'heading',
                props: { level: '2', children: 'Executive summary' },
                children: [],
              },
            ],
          },
        },
      ],
    },
    'settings-app': {
      id: 'settings-golden',
      name: 'Account settings',
      pages: [
        {
          id: 'profile',
          name: 'Profile',
          path: '/profile',
          rootNode: {
            id: 'card-settings',
            componentId: 'card',
            props: { padding: 'md' },
            children: [
              {
                id: 'heading-settings',
                componentId: 'heading',
                props: { level: '2', children: 'General Settings' },
                children: [],
              },
            ],
          },
        },
      ],
    },
    'docs-page': {
      id: 'docs-golden',
      name: 'Developer docs',
      pages: [
        {
          id: 'intro',
          name: 'Introduction',
          path: '/intro',
          rootNode: {
            id: 'card-docs',
            componentId: 'card',
            props: { padding: 'lg' },
            children: [
              {
                id: 'heading-docs',
                componentId: 'heading',
                props: { level: '1', children: 'Getting started' },
                children: [],
              },
            ],
          },
        },
      ],
    },
    'pricing-site': {
      id: 'pricing-golden',
      name: 'Pricing plans',
      pages: [
        {
          id: 'plans',
          name: 'Plans',
          path: '/plans',
          rootNode: {
            id: 'card-pricing',
            componentId: 'card',
            props: { padding: 'lg' },
            children: [
              {
                id: 'heading-pricing',
                componentId: 'heading',
                props: { level: '2', children: 'Pick a plan' },
                children: [],
              },
            ],
          },
        },
      ],
    },
  };

  for (const [name, project] of Object.entries(fixtures)) {
    for (const target of targets) {
      it(`renders golden fixture "${name}" successfully for target "${target}"`, () => {
        const request: ExportRequest = { target, project };
        const normalized = normalizeExportProject(request);
        const analyzed = analyzeExportProject(normalized);
        const enriched = enrichExportProject(analyzed);
        const rendered = renderExportProject(enriched);

        expect(rendered.files.length).toBeGreaterThan(0);
        expect(rendered.diagnostics).toEqual([]);

        // Validate structure properties in rendered index/App file
        if (target === 'react-single-page') {
          const appFile = rendered.files.find((f) => f.path === 'src/App.tsx');
          expect(appFile).toBeDefined();
          expect(appFile?.content).toContain(project.id);
        } else if (target === 'html-static') {
          const htmlFile = rendered.files.find((f) => f.path === 'index.html');
          expect(htmlFile).toBeDefined();
          expect(htmlFile?.content).toContain(project.id);
        } else if (target === 'web-components-static') {
          const htmlFile = rendered.files.find((f) => f.path === 'index.html');
          expect(htmlFile).toBeDefined();
          expect(htmlFile?.content).toContain(project.id);
        }
      });
    }
  }
});
