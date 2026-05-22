/** Lightweight calendar helpers (no date-fns). */

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

export function subMonths(date: Date, amount: number): Date {
  return addMonths(date, -amount);
}

/** @param weekStartsOn 0 = Sunday, 1 = Monday, … */
export function startOfWeek(date: Date, weekStartsOn = 0): Date {
  const next = new Date(date);
  const day = next.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  next.setDate(next.getDate() - diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfWeek(date: Date, weekStartsOn = 0): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isSameDay(a: Date, b: Date): boolean {
  return isSameMonth(a, b) && a.getDate() === b.getDate();
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Subset used by Calendar / DatePicker */
export function formatCalendar(
  date: Date,
  pattern: 'MMMM yyyy' | 'd' | 'yyyy-MM-dd'
): string {
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
