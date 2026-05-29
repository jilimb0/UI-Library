/**
 * autosave.test.ts
 * Unit tests for the autosave / recovery draft module.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// localStorage mock — must be set up before importing the module
// ---------------------------------------------------------------------------

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// ---------------------------------------------------------------------------
// Module under test (imported after the mock is in place)
// ---------------------------------------------------------------------------

import {
  cancelAutosave,
  clearRecoveryDraft,
  flushAutosave,
  getRecoveryDraftSummary,
  hasRecoverableDraft,
  loadRecoveryDraft,
  scheduleAutosave,
} from './autosave';

import type { BuilderProject } from './types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeProject(id: string): BuilderProject {
  return {
    id,
    name: `Project ${id}`,
    pages: [
      {
        id: `${id}-page-1`,
        title: 'Page 1',
        root: {
          id: `${id}-root`,
          componentId: 'card',
          props: { title: 'Hello' },
          children: [],
        },
      },
    ],
    publish: {
      status: 'draft',
      publishedAt: null,
      publishedBy: null,
      sourceVersionId: null,
    },
    members: [
      { userId: 'local-owner', email: 'owner@builder.dev', role: 'owner' },
    ],
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('autosave — flushAutosave and loadRecoveryDraft', () => {
  beforeEach(() => localStorageMock.clear());
  afterEach(() => vi.useRealTimers());

  it('writes a draft immediately on flushAutosave', () => {
    const projects = [makeProject('p1'), makeProject('p2')];
    flushAutosave(projects, 'p1-page-1');

    const draft = loadRecoveryDraft();
    expect(draft).not.toBeNull();
    expect(draft?.projects).toHaveLength(2);
    expect(draft?.activePageId).toBe('p1-page-1');
    expect(draft?.projectIds).toEqual(['p1', 'p2']);
    expect(typeof draft?.savedAt).toBe('string');
  });

  it('returns null when nothing has been saved', () => {
    expect(loadRecoveryDraft()).toBeNull();
  });

  it('returns null when the stored value is corrupt JSON', () => {
    localStorageMock.setItem(
      'ui-builder-autosave-recovery-v1',
      '{ broken json ~~'
    );
    expect(loadRecoveryDraft()).toBeNull();
  });

  it('returns null when stored object is missing required fields', () => {
    localStorageMock.setItem(
      'ui-builder-autosave-recovery-v1',
      JSON.stringify({ foo: 'bar' })
    );
    expect(loadRecoveryDraft()).toBeNull();
  });
});

describe('autosave — clearRecoveryDraft', () => {
  beforeEach(() => localStorageMock.clear());

  it('removes the draft from localStorage', () => {
    flushAutosave([makeProject('p1')], null);
    expect(loadRecoveryDraft()).not.toBeNull();

    clearRecoveryDraft();
    expect(loadRecoveryDraft()).toBeNull();
  });

  it('is idempotent — does not throw when nothing is stored', () => {
    expect(() => clearRecoveryDraft()).not.toThrow();
  });
});

describe('autosave — hasRecoverableDraft', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns true for a fresh draft', () => {
    flushAutosave([makeProject('p1')], 'p1-page-1');
    expect(hasRecoverableDraft()).toBe(true);
  });

  it('returns false when no draft exists', () => {
    expect(hasRecoverableDraft()).toBe(false);
  });

  it('returns false and clears a draft older than maxAgeMs', () => {
    // Write a draft with a timestamp 2 hours in the past
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const stale = {
      savedAt: twoHoursAgo,
      activePageId: null,
      projects: [makeProject('p-old')],
    };
    localStorageMock.setItem(
      'ui-builder-autosave-recovery-v1',
      JSON.stringify(stale)
    );

    // maxAgeMs = 1 hour → the 2-hour-old draft should be rejected
    expect(hasRecoverableDraft(60 * 60 * 1000)).toBe(false);
    // Also cleared from storage
    expect(loadRecoveryDraft()).toBeNull();
  });

  it('returns true for a draft within maxAgeMs', () => {
    flushAutosave([makeProject('p1')], null);
    expect(hasRecoverableDraft(60 * 60 * 1000)).toBe(true);
  });
});

describe('autosave — getRecoveryDraftSummary', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns null when no draft exists', () => {
    expect(getRecoveryDraftSummary()).toBeNull();
  });

  it('returns a human-readable string when a draft exists', () => {
    flushAutosave([makeProject('p1'), makeProject('p2')], null);
    const summary = getRecoveryDraftSummary();
    expect(summary).not.toBeNull();
    expect(summary).toMatch(/2 projects/i);
  });

  it('uses singular "project" for a single project', () => {
    flushAutosave([makeProject('p1')], null);
    const summary = getRecoveryDraftSummary();
    expect(summary).toMatch(/1 project(?!s)/i);
  });
});

describe('autosave — scheduleAutosave debounce', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('does not write immediately on scheduleAutosave', () => {
    scheduleAutosave([makeProject('p1')], null);
    expect(loadRecoveryDraft()).toBeNull();
  });

  it('writes after the debounce delay elapses', () => {
    scheduleAutosave([makeProject('p1')], 'p1-page-1');
    vi.advanceTimersByTime(3001);
    const draft = loadRecoveryDraft();
    expect(draft).not.toBeNull();
    expect(draft?.projects[0]?.id).toBe('p1');
  });

  it('collapses rapid calls into a single write', () => {
    scheduleAutosave([makeProject('p1')], null);
    scheduleAutosave([makeProject('p1'), makeProject('p2')], null);
    scheduleAutosave(
      [makeProject('p1'), makeProject('p2'), makeProject('p3')],
      null
    );

    vi.advanceTimersByTime(3001);

    const draft = loadRecoveryDraft();
    // Only the final call's state is persisted
    expect(draft?.projects).toHaveLength(3);
  });

  it('cancelAutosave prevents the write', () => {
    scheduleAutosave([makeProject('p1')], null);
    cancelAutosave();
    vi.advanceTimersByTime(5000);
    expect(loadRecoveryDraft()).toBeNull();
  });
});
