import {
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
} from '@ui-construction-library/utils';
import {
  type FC,
  type ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

export interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  timezone?: string;
  initialMonth?: Date;
  /** Earliest selectable date. */
  minDate?: Date;
  /** Latest selectable date. */
  maxDate?: Date;
  /** Accessible name for the calendar widget. */
  label?: string;
  /** Disable the entire date picker. */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DatePicker: FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  initialMonth,
  minDate,
  maxDate,
  label = 'Select date',
  disabled = false,
  className,
  style,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth ?? selectedDate ?? new Date()
  );
  const gridRef = useRef<HTMLTableSectionElement>(null);

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (disabled) return true;
      if (
        minDate &&
        date < startOfMonth(minDate) &&
        !isSameDay(date, minDate) &&
        date < minDate
      )
        return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [disabled, minDate, maxDate]
  );

  const handleDayKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableCellElement>, day: Date) => {
      let nextDay: Date | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextDay = addDays(day, 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextDay = addDays(day, -1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextDay = addDays(day, 7);
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextDay = addDays(day, -7);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isDateDisabled(day)) {
            onChange(day);
          }
          return;
        default:
          return;
      }

      if (nextDay) {
        // If navigating to a different month, shift the view
        if (!isSameMonth(nextDay, currentMonth)) {
          setCurrentMonth(startOfMonth(nextDay));
        }
        // Focus the target cell after render
        requestAnimationFrame(() => {
          if (gridRef.current) {
            const target = gridRef.current.querySelector(
              `[data-date="${nextDay!.toISOString().slice(0, 10)}"]`
            ) as HTMLElement;
            target?.focus();
          }
        });
      }
    },
    [currentMonth, isDateDisabled, onChange]
  );

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(startMonth);
  const endDate = endOfWeek(endMonth);

  const rows: ReactElement[] = [];
  let days: ReactElement[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isOutside = !isSameMonth(cloneDay, currentMonth);
      const isSelected = selectedDate
        ? isSameDay(cloneDay, selectedDate)
        : false;
      const isDayDisabled = isDateDisabled(cloneDay);
      const dateStr = cloneDay.toISOString().slice(0, 10);

      days.push(
        <td
          key={dateStr}
          tabIndex={
            isSelected || (!selectedDate && isSameDay(cloneDay, new Date()))
              ? 0
              : -1
          }
          aria-disabled={isDayDisabled || undefined}
          data-date={dateStr}
          className={cn(
            'date-picker__day',
            isOutside && 'date-picker__day--outside',
            isSelected && 'date-picker__day--selected',
            isDayDisabled && 'date-picker__day--disabled'
          )}
          onClick={() => !isDayDisabled && onChange(cloneDay)}
          onKeyDown={(e) => handleDayKeyDown(e, cloneDay)}
        >
          {formatCalendar(cloneDay, 'd')}
        </td>
      );
      day = addDays(day, 1);
    }
    rows.push(<tr key={day.toString()}>{days}</tr>);
    days = [];
  }

  return (
    <fieldset
      className={cn('date-picker', className)}
      style={style}
      disabled={disabled}
    >
      <legend className="field-label">{label}</legend>
      <div className="date-picker__nav">
        <button
          type="button"
          className="button button--outline button--sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          aria-label="Previous month"
        >
          ←
        </button>
        <span aria-live="polite">
          {formatCalendar(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          className="button button--outline button--sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          aria-label="Next month"
        >
          →
        </button>
      </div>
      <table className="date-picker__table" aria-label={label}>
        <thead>
          <tr>
            {WEEKDAYS.map((dayName) => (
              <th key={dayName} scope="col" abbr={dayName}>
                {dayName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={gridRef}>{rows}</tbody>
      </table>
    </fieldset>
  );
};

export default DatePicker;
