import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import userEvent from "@testing-library/user-event"
import { Input } from "./Input"
import React from "react"
import "@testing-library/jest-dom"

describe("Input Accessibility", () => {
  it("should have proper ARIA attributes", () => {
    render(<Input label="Test" description="Description" />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-labelledby")
    expect(input).toHaveAttribute("aria-describedby")
  })

  it("should support keyboard navigation", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<Input label="Test" onChange={onChange} />)

    const input = screen.getByRole("textbox")
    await user.tab()
    expect(input).toHaveFocus()

    await user.keyboard(" ")
    expect(onChange).toHaveBeenCalled()
  })
})
