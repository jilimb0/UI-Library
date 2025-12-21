import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import userEvent from "@testing-library/user-event"
import { Select } from "./Select"
import React from "react"

describe("Select Accessibility", () => {
  it("should have proper ARIA attributes", () => {
    render(
      <Select
        label="Test"
        description="Description"
        aria-labelledby="test-label"
      />
    )

    const select = screen.getByRole("combobox")
    expect(select).toHaveAttribute("aria-labelledby")
    expect(select).toHaveAttribute("aria-describedby")
  })

  it("should support keyboard navigation", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<Select label="Test" onChange={onChange} />)

    const select = screen.getByRole("combobox")
    await user.tab()
    expect(select).toHaveFocus()

    await user.keyboard(" ")
    expect(onChange).toHaveBeenCalled()
  })
})
