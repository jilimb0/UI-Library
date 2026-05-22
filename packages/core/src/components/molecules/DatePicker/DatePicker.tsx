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
import { type FC, type ReactElement, useState } from 'react';
import { cn } from '../../../utils/cn';

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  timezone?: string;
  initialMonth?: Date;
  /** Accessible name for the calendar widget. */
  label?: string;
}

const DatePicker: FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  initialMonth,
  label = 'Select date',
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());

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
      const isSelected = isSameDay(cloneDay, selectedDate || new Date());
      days.push(
        <td
          key={cloneDay.toString()}
          className={cn(
            'date-picker__day',
            isOutside && 'date-picker__day--outside',
            isSelected && 'date-picker__day--selected'
          )}
          onClick={() => onChange(cloneDay)}
          onKeyDown={(e) => e.key === 'Enter' && onChange(cloneDay)}
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
    <fieldset className="date-picker">
      <legend className="field-label">{label}</legend>
      <div className="date-picker__nav">
        <button
          type="button"
          className="button button--outline button--sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          Prev
        </button>
        <span>{formatCalendar(currentMonth, 'MMMM yyyy')}</span>
        <button
          type="button"
          className="button button--outline button--sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          Next
        </button>
      </div>
      <table className="date-picker__table">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (dayName) => (
                <th key={dayName}>{dayName}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </fieldset>
  );
};

export default DatePicker;
