import {
  baseCompatibility,
  commonClassNameProp,
  type RegistryComponent,
} from './shared';

export const dataDisplayComponents: RegistryComponent[] = [
  {
    id: 'calendar',
    slug: 'calendar',
    displayName: 'Calendar',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'data-display',
    description: 'Month grid with event markers.',
    status: 'stable',
    tags: ['date', 'schedule'],
    props: [commonClassNameProp],
    slots: ['grid'],
    events: [],
    states: ['default'],
    a11y: {
      role: 'grid',
      keyboard: ['Arrow keys', 'PageUp', 'PageDown'],
      focusBehavior: 'Month controls are keyboard accessible.',
      screenReaderNotes: ['Month and events should be announced clearly.'],
    },
    responsiveBehavior: ['fluid'],
    styleHooks: ['calendar.cell'],
    builder: { editingSurface: 'layout-container', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
];
