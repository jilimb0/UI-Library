import {
  createDefaultMembers,
  createDefaultPublishRecord,
} from './persistence';
import type { BuilderProject } from './types';

export const mockProjects: BuilderProject[] = [
  {
    id: 'marketing-site',
    name: 'Marketing Site',
    publish: createDefaultPublishRecord(),
    members: createDefaultMembers(),
    pages: [
      {
        id: 'landing',
        title: 'Landing',
        root: {
          id: 'landing-root',
          componentId: 'stack',
          props: { gap: '24', padding: '32' },
          children: [
            {
              id: 'hero-card',
              componentId: 'card',
              props: {
                title: 'Build faster',
                body: 'Registry-backed page scaffolds with page comments and versions.',
              },
              children: [],
            },
          ],
        },
      },
    ],
  },
];
