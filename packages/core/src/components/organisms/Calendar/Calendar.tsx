import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  formatCalendar,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  toDateKey,
} from '@ui-construction-library/utils';
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
    const start = startOfWeek(startOfMonth(currentMonth), 1);
    const end = endOfWeek(endOfMonth(currentMonth), 1);
    const result: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      result.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [currentMonth]);

  return (
    <div className={cn('calendar-panel', className)}>
      <div className="calendar-nav">
        <button
          type="button"
          className="button button--outline button--sm"
          onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
        >
          Prev
        </button>
        <h3 className="modal-title">
          {formatCalendar(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          className="button button--outline button--sm"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          Next
        </button>
      </div>
      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="calendar-weekday">
            {d}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const dayEvents = events.filter(
            (e) => toDateKey(e.date) === toDateKey(day)
          );
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'calendar-cell',
                !inMonth && 'calendar-cell--outside'
              )}
            >
              <div className="calendar-cell__day">
                {formatCalendar(day, 'd')}
              </div>
              <div className="stack-vertical" style={{ gap: '0.25rem' }}>
                {dayEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="calendar-cell__event">
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
