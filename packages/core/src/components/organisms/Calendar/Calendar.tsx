import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

export function Calendar({ events = [], className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const result: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      result.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [currentMonth]);

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-4',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
        >
          Prev
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs font-medium text-slate-500">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const dayEvents = events.filter(
            (e) => format(e.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-20 rounded border p-1',
                inMonth ? 'bg-white' : 'bg-slate-50 text-slate-400'
              )}
            >
              <div className="text-xs font-medium">{format(day, 'd')}</div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded bg-blue-50 px-1 text-[10px] text-blue-700"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
