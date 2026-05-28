/**
 * autosave.ts
 *
 * Lightweight autosave / unsaved-edit recovery layer for the builder.
 *
 * Design goals:
 *  - Zero-cost when nothing is dirty (no timers when clean)
 *  - Writes a compact recovery draft to localStorage under a separate key so
 *    it never corrupts the canonical project store
 *  - On load, callers can call `loadRecoveryDraft()` and decide whether to
 *    restore or discard
 *  - All reads are guarded: JSON parse failures return null rather than throwing
 *
 * Usage:
 *   // Start autosave when the user makes a change
 *   scheduleAutosave(projects, pageId);
 *
 *   // On app boot, check for an unrecovered draft
 *   const draft = loadRecoveryDraft();
 *   if (draft) { ... prompt user to restore or discard ... }
 *
 *   // After a successful save / publish / explicit discard:
 *   clearRecoveryDraft();
 */

import type { BuilderProject } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RECOVERY_KEY = 'ui-builder-autosave-recovery-v1';
const AUTOSAVE_DELAY_MS = 3000; // 3 s debounce — aggressive enough to feel live

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AutosaveRecoveryDraft = {
  /** ISO timestamp of when this draft was written */
  savedAt: string;
  /** The page that was active when the autosave fired */
  activePageId: string | null;
  /** Snapshot of all projects at the time of autosave */
  projects: BuilderProject[];
};

// ---------------------------------------------------------------------------
// Internal timer handle
// ---------------------------------------------------------------------------

let _pendingTimer: ReturnType<typeof setTimeout> | null = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Schedule an autosave of the current project state.
 * Debounced — multiple rapid calls within AUTOSAVE_DELAY_MS collapse into one.
 */
export function scheduleAutosave(
  projects: BuilderProject[],
  activePageId: string | null
): void {
  if (_pendingTimer !== null) {
    clearTimeout(_pendingTimer);
  }
  _pendingTimer = setTimeout(() => {
    _pendingTimer = null;
    commitAutosave(projects, activePageId);
  }, AUTOSAVE_DELAY_MS);
}

/**
 * Flush any pending debounced autosave immediately.
 * Call this before navigation or unmount to avoid losing the last edit.
 */
export function flushAutosave(
  projects: BuilderProject[],
  activePageId: string | null
): void {
  if (_pendingTimer !== null) {
    clearTimeout(_pendingTimer);
    _pendingTimer = null;
  }
  commitAutosave(projects, activePageId);
}

/**
 * Cancel any pending autosave timer without writing.
 * Call after a successful explicit save or publish.
 */
export function cancelAutosave(): void {
  if (_pendingTimer !== null) {
    clearTimeout(_pendingTimer);
    _pendingTimer = null;
  }
}

/**
 * Read a previously written recovery draft from localStorage.
 * Returns null if nothing was saved or the stored value is corrupt.
 */
export function loadRecoveryDraft(): AutosaveRecoveryDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(RECOVERY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidRecoveryDraft(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Discard the stored recovery draft.
 * Call after the user explicitly restores, discards, or publishes.
 */
export function clearRecoveryDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECOVERY_KEY);
  } catch {
    // localStorage may be unavailable (private mode quota)
  }
}

/**
 * Returns true when a non-expired recovery draft is available.
 * Drafts older than maxAgeMs (default 24 h) are treated as stale and discarded.
 */
export function hasRecoverableDraft(maxAgeMs = 24 * 60 * 60 * 1000): boolean {
  const draft = loadRecoveryDraft();
  if (!draft) return false;
  const age = Date.now() - new Date(draft.savedAt).getTime();
  if (age > maxAgeMs) {
    clearRecoveryDraft();
    return false;
  }
  return true;
}

/**
 * Returns a human-readable summary of the recovery draft for use in a
 * confirmation banner, e.g. "Unsaved edits from 3 minutes ago".
 */
export function getRecoveryDraftSummary(): string | null {
  const draft = loadRecoveryDraft();
  if (!draft) return null;
  const savedAt = new Date(draft.savedAt);
  const ageMs = Date.now() - savedAt.getTime();
  const label = formatAge(ageMs);
  const projectCount = draft.projects.length;
  return `Unsaved edits from ${label} across ${projectCount} project${projectCount === 1 ? '' : 's'}.`;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function commitAutosave(
  projects: BuilderProject[],
  activePageId: string | null
): void {
  if (typeof window === 'undefined') return;
  const draft: AutosaveRecoveryDraft = {
    savedAt: new Date().toISOString(),
    activePageId,
    projects,
  };
  try {
    window.localStorage.setItem(RECOVERY_KEY, JSON.stringify(draft));
  } catch {
    // Quota exceeded or unavailable — silently skip
  }
}

function isValidRecoveryDraft(value: unknown): value is AutosaveRecoveryDraft {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.savedAt === 'string' && Array.isArray(obj.projects);
}

function formatAge(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}
