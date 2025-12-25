import { render, screen } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"
import { TextArea } from "./TextArea"
import React from "react"
import "@testing-library/jest-dom"

expect.extend(toHaveNoViolations)

describe("TextArea component", () => {
  it("renders without crashing", () => {
    render(<TextArea aria-label="Test textarea" defaultValue="Example" />)
    expect(screen.getByLabelText("Test textarea")).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TextArea aria-label="Test textarea" defaultValue="Example" />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
