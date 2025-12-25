import { render, screen, fireEvent } from "@testing-library/react"
import { Select } from "./Select"
import React from "react"
import "@testing-library/jest-dom"

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
]

describe("Select", () => {
  it("renders with options", () => {
    render(<Select options={options} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("handles selection changes", () => {
    const onChange = jest.fn()
    render(<Select options={options} onChange={onChange} />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } })
    expect(onChange).toHaveBeenCalledTimes(1)
    const event = onChange.mock.calls[0][0]
    expect(event.target.value).toBe("2")
  })
})
