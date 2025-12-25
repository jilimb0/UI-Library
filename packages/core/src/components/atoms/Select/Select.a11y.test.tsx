import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Select } from "./Select"
import React from "react"
import "@testing-library/jest-dom"

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
]

describe("Select Accessibility", () => {
  it("should have proper ARIA attributes", () => {
    render(
      <Select
        label="Test"
        description="Description"
        aria-labelledby="test-label"
        options={options}
      />
    )

    const select = screen.getByRole("combobox")
    expect(select).toHaveAttribute("aria-labelledby")
    expect(select).toHaveAttribute("aria-describedby")
  })

  it("should support keyboard navigation", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<Select label="Test" onChange={onChange} options={options} />)

    const select = screen.getByRole("combobox")
    await user.tab()
    expect(select).toHaveFocus()

    await user.selectOptions(screen.getByRole("combobox"), "2")
    expect(onChange).toHaveBeenCalled()
  })
})
