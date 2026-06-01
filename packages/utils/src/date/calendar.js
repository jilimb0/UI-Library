/** Lightweight calendar helpers (no date-fns). */
export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}
export function addMonths(date, amount) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}
export function subMonths(date, amount) {
  return addMonths(date, -amount);
}
/** @param weekStartsOn 0 = Sunday, 1 = Monday, … */
export function startOfWeek(date, weekStartsOn = 0) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  next.setDate(next.getDate() - diff);
  next.setHours(0, 0, 0, 0);
  return next;
}
export function endOfWeek(date, weekStartsOn = 0) {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}
export function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
export function isSameDay(a, b) {
  return isSameMonth(a, b) && a.getDate() === b.getDate();
}
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
/** Subset used by Calendar / DatePicker */
export function formatCalendar(date, pattern) {
  if (pattern === 'd') {
    return String(date.getDate());
  }
  if (pattern === 'yyyy-MM-dd') {
    return toDateKey(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}
