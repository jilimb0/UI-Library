import { describe, expect, it } from 'vitest';
import {
  addDays,
  formatCalendar,
  isSameDay,
  startOfMonth,
  startOfWeek,
  toDateKey,
} from './calendar';

describe('calendar utils', () => {
  it('formats and compares dates', () => {
    const date = new Date(2026, 4, 22);
    expect(formatCalendar(date, 'd')).toBe('22');
    expect(toDateKey(date)).toBe('2026-05-22');
    expect(isSameDay(date, new Date(2026, 4, 22))).toBe(true);
  });

  it('walks weeks from month start', () => {
    const month = startOfMonth(new Date(2026, 4, 15));
    const weekStart = startOfWeek(month, 1);
    expect(addDays(weekStart, 6).getDay()).toBe(0);
  });
});
