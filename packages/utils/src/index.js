/**
 * @ui-construction-library/utils — public barrel.
 *
 * This package is internal-first. Only the exports listed here are considered
 * stable. Everything else is implementation detail for core components.
 *
 * Consumers: use @ui-construction-library/core as your primary entrypoint.
 * Do not take a direct dependency on this package in application code.
 */
// ── Stable public utilities ──────────────────────────────────────────────────
// These are safe to use in extension packages and advanced consumers.

// ── Internal calendar/date utilities ─────────────────────────────────────────
// Used by core's Calendar and DatePicker components.
// Not part of the stable public API — may change without a migration guide.
export {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  formatCalendar,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  toDateKey,
} from './date/calendar';
export { formatDate } from './date/format';
export { parseDate } from './date/parse';
export { formatRelative } from './date/relative';
export { clamp } from './number/clamp';
export { formatNumber } from './number/format';
// ── Internal number utilities ─────────────────────────────────────────────────
export { random } from './number/random';
export { merge } from './object/merge';
export { omit } from './object/omit';
export { pick } from './object/pick';
export { capitalize } from './string/capitalize';
export { slugify } from './string/slugify';
export { truncate } from './string/truncate';
