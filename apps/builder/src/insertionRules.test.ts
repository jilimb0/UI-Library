import type { RegistryComponent } from '@ui-construction-library/registry';
import { describe, expect, it } from 'vitest';
import { getInsertionBlockReason } from './insertionRules';
import type { LayoutNode } from './types';

const mk = (id: string): LayoutNode => ({
  id: `${id}-1`,
  componentId: id,
  props: {},
  children: [],
});
const components: RegistryComponent[] = [
  {
    id: 'card',
    slug: 'card',
    displayName: 'Card',
    package: 'x',
    version: '0',
    category: 'layout',
    description: '',
    status: 'stable',
    tags: [],
    props: [],
    slots: [],
    events: [],
    states: [],
    a11y: { keyboard: [], screenReaderNotes: [] },
    responsiveBehavior: [],
    styleHooks: [],
    builder: {
      editingSurface: 'layout-container',
      editable: 'container',
      allowChildren: true,
    },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: {
      react: true,
      next: true,
      static: false,
      webComponents: false,
      vue: false,
      angular: false,
    },
  },
  {
    id: 'input',
    slug: 'input',
    displayName: 'Input',
    package: 'x',
    version: '0',
    category: 'forms',
    description: '',
    status: 'stable',
    tags: [],
    props: [],
    slots: [],
    events: [],
    states: [],
    a11y: { keyboard: [], screenReaderNotes: [] },
    responsiveBehavior: [],
    styleHooks: [],
    builder: {
      editingSurface: 'prop-driven',
      editable: 'prop-driven',
      allowChildren: false,
    },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: {
      react: true,
      next: true,
      static: false,
      webComponents: false,
      vue: false,
      angular: false,
    },
  },
  {
    id: 'link',
    slug: 'link',
    displayName: 'Link',
    package: 'x',
    version: '0',
    category: 'navigation',
    description: '',
    status: 'stable',
    tags: [],
    props: [],
    slots: [],
    events: [],
    states: [],
    a11y: { keyboard: [], screenReaderNotes: [] },
    responsiveBehavior: [],
    styleHooks: [],
    builder: {
      editingSurface: 'inline-editable',
      editable: 'inline',
      allowChildren: true,
      insertionRules: { blockedInsideInteractive: true },
    },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: {
      react: true,
      next: true,
      static: false,
      webComponents: false,
      vue: false,
      angular: false,
    },
  },
  {
    id: 'button',
    slug: 'button',
    displayName: 'Button',
    package: 'x',
    version: '0',
    category: 'actions',
    description: '',
    status: 'stable',
    tags: [],
    props: [],
    slots: [],
    events: [],
    states: [],
    a11y: { keyboard: [], screenReaderNotes: [] },
    responsiveBehavior: [],
    styleHooks: [],
    builder: {
      editingSurface: 'prop-driven',
      editable: 'prop-driven',
      allowChildren: true,
      insertionRules: { blockedInsideInteractive: true },
    },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: {
      react: true,
      next: true,
      static: false,
      webComponents: false,
      vue: false,
      angular: false,
    },
  },
  {
    id: 'tooltip',
    slug: 'tooltip',
    displayName: 'Tooltip',
    package: 'x',
    version: '0',
    category: 'feedback',
    description: '',
    status: 'stable',
    tags: [],
    props: [],
    slots: ['trigger'],
    events: [],
    states: [],
    a11y: { keyboard: [], screenReaderNotes: [] },
    responsiveBehavior: [],
    styleHooks: [],
    builder: {
      editingSurface: 'advanced',
      editable: 'advanced',
      allowChildren: true,
      insertionRules: {
        requiresSelectedParent: true,
        blockedParentIds: ['tooltip'],
      },
    },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: {
      react: true,
      next: true,
      static: false,
      webComponents: false,
      vue: false,
      angular: false,
    },
  },
  {
    id: 'text',
    slug: 'text',
    displayName: 'Text',
    package: 'x',
    version: '0',
    category: 'typography',
    description: '',
    status: 'stable',
    tags: [],
    props: [],
    slots: [],
    events: [],
    states: [],
    a11y: { keyboard: [], screenReaderNotes: [] },
    responsiveBehavior: [],
    styleHooks: [],
    builder: {
      editingSurface: 'inline-editable',
      editable: 'inline',
      allowChildren: true,
    },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: {
      react: true,
      next: true,
      static: false,
      webComponents: false,
      vue: false,
      angular: false,
    },
  },
];

describe('insertionRules', () => {
  it('blocks insertion into non-container target', () => {
    expect(getInsertionBlockReason(components, 'text', mk('input'))).toContain(
      'does not allow children'
    );
  });

  it('blocks interactive-in-interactive', () => {
    expect(getInsertionBlockReason(components, 'button', mk('link'))).toContain(
      'Cannot nest interactive'
    );
  });

  it('blocks tooltip without selected parent', () => {
    expect(getInsertionBlockReason(components, 'tooltip', null)).toContain(
      'Select a parent'
    );
  });

  it('allows text into card', () => {
    expect(getInsertionBlockReason(components, 'text', mk('card'))).toBeNull();
  });
});
