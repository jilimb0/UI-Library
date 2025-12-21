import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "./Checkbox"
import React from "react"
import "@testing-library/jest-dom"
import "jest-axe/extend-expect"

describe("Checkbox Accessibility", () => {
  it("should have proper ARIA attributes", () => {
    render(<Checkbox label="Test" description="Description" />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("aria-labelledby")
    expect(checkbox).toHaveAttribute("aria-describedby")
  })

  it("should support keyboard navigation", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<Checkbox label="Test" onChange={onChange} />)

    const checkbox = screen.getByRole("checkbox")
    await user.tab()
    expect(checkbox).toHaveFocus()

    await user.keyboard(" ")
    expect(onChange).toHaveBeenCalled()
  })

  it("should announce errors to screen readers", async () => {
    const { container } = render(
      <Checkbox label="Test" error errorMessage="This field is required" />
    )

    const errorMessage = screen.getByText("This field is required")
    expect(errorMessage).toHaveAttribute("aria-live", "polite")

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
