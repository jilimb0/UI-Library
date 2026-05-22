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
  // timezone,
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
      days.push(
        <td
          key={cloneDay.toString()}
          className={`${
            !isSameMonth(cloneDay, currentMonth) ? 'text-gray-400' : ''
          } ${
            isSameDay(cloneDay, selectedDate || new Date())
              ? 'bg-blue-500 text-white'
              : ''
          } cursor-pointer p-2 text-center`}
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
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          Prev
        </button>
        <span>{formatCalendar(currentMonth, 'MMMM yyyy')}</span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          Next
        </button>
      </div>
      <table className="w-full border-collapse">
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
