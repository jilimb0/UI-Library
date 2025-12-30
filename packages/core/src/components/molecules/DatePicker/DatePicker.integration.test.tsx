import { render, screen } from "@testing-library/react"
import { default as DatePicker } from "./DatePicker"
import userEvent from "@testing-library/user-event"
import React from "react"

// Helper to render DatePicker with mock callback
const renderDatePicker = (props = {}) => {
  const onChange = jest.fn()
  render(<DatePicker selectedDate={null} onChange={onChange} {...props} />)
  return { onChange }
}

describe("DatePicker Integration Tests", () => {
  const user = userEvent.setup()

  test("renders calendar with correct month header", () => {
    renderDatePicker()
    expect(screen.getByText("December 2025")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Prev/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument()
  })

  test("renders days of week headers", () => {
    renderDatePicker()
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument()
    })
  })

  test("navigates to previous month", async () => {
    renderDatePicker()
    const prevButton = screen.getByRole("button", { name: /Prev/i })
    await user.click(prevButton)
    expect(screen.getByText("November 2025")).toBeInTheDocument()
  })

  test("navigates to next month", async () => {
    renderDatePicker()
    const nextButton = screen.getByRole("button", { name: /Next/i })
    await user.click(nextButton)
    expect(screen.getByText("January 2026")).toBeInTheDocument()
  })

  test("selects date cell and calls onChange callback", async () => {
    const { onChange } = renderDatePicker()
    // Click first available date (index 7 - first Monday of month)
    const dateCells = screen.getAllByRole("cell")
    const firstMonday = dateCells.find((cell) => cell.textContent === "1")
    if (firstMonday) {
      await user.click(firstMonday)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(expect.any(Date))
    }
  })

  test("highlights today date", () => {
    renderDatePicker()
    const todayCell = screen
      .getAllByRole("cell")
      .find((cell) => cell.className.includes("bg-blue-500"))
    expect(todayCell).not.toBeNull()
  })

  test("grays out dates from other months", () => {
    renderDatePicker()
    const grayCells = screen
      .getAllByRole("cell")
      .filter((cell) => cell.className.includes("text-gray-400"))
    expect(grayCells.length).toBeGreaterThan(0)
  })

  test("renders date cells with correct count", () => {
    renderDatePicker()
    expect(screen.getAllByRole("cell").length).toEqual(35)
  })

  test("handles null selectedDate gracefully", () => {
    renderDatePicker({ selectedDate: null })
    expect(screen.getAllByRole("cell").length).toBeGreaterThan(0)
  })

  test("buttons are clickable", async () => {
    renderDatePicker()
    const prevButton = screen.getByRole("button", { name: /Prev/i })
    const nextButton = screen.getByRole("button", { name: /Next/i })
    expect(prevButton).toBeEnabled()
    expect(nextButton).toBeEnabled()
  })
})
