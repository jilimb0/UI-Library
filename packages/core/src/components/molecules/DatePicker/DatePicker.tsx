import React, { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns"

interface DatePickerProps {
  selectedDate: Date | null
  onChange: (date: Date) => void
  timezone?: string
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  timezone,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const startMonth = startOfMonth(currentMonth)
  const endMonth = endOfMonth(currentMonth)
  const startDate = startOfWeek(startMonth)
  const endDate = endOfWeek(endMonth)

  const dateFormat = "d"
  const rows: JSX.Element[][] = []
  let days: JSX.Element[] = []
  let day = startDate

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day
      days.push(
        <td
          key={cloneDay.toString()}
          className={`${
            !isSameMonth(cloneDay, currentMonth) ? "text-gray-400" : ""
          } ${
            isSameDay(cloneDay, selectedDate || new Date())
              ? "bg-blue-500 text-white"
              : ""
          } cursor-pointer p-2 text-center`}
          onClick={() => onChange(cloneDay)}
        >
          {format(cloneDay, dateFormat)}
        </td>
      )
      day = addDays(day, 1)
    }
    rows.push(<tr key={day.toString()}>{days}</tr>)
    days = []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          Prev
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Next
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

export default DatePicker
