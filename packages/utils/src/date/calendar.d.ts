/** Lightweight calendar helpers (no date-fns). */
export declare function startOfMonth(date: Date): Date;
export declare function endOfMonth(date: Date): Date;
export declare function addDays(date: Date, amount: number): Date;
export declare function addMonths(date: Date, amount: number): Date;
export declare function subMonths(date: Date, amount: number): Date;
/** @param weekStartsOn 0 = Sunday, 1 = Monday, … */
export declare function startOfWeek(date: Date, weekStartsOn?: number): Date;
export declare function endOfWeek(date: Date, weekStartsOn?: number): Date;
export declare function isSameMonth(a: Date, b: Date): boolean;
export declare function isSameDay(a: Date, b: Date): boolean;
export declare function toDateKey(date: Date): string;
/** Subset used by Calendar / DatePicker */
export declare function formatCalendar(
  date: Date,
  pattern: 'MMMM yyyy' | 'd' | 'yyyy-MM-dd'
): string;
