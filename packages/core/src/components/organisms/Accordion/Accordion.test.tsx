import { render, screen } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"
import { Accordion } from "./Accordion"
import React from "react"

expect.extend(toHaveNoViolations)

describe("Accordion component", () => {
  it("renders without crashing", () => {
    render(<Accordion>Example</Accordion>)
    expect(screen.getByText("Example")).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Accordion>Example</Accordion>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
