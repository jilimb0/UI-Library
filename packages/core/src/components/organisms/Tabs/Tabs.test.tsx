import { render, screen, fireEvent } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"
import { Tabs } from "./Tabs"
import React from "react"

expect.extend(toHaveNoViolations)

describe("Tabs", () => {
  it("renders without crashing", () => {
    const { container } = render(<Tabs>Example</Tabs>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Tabs>Example</Tabs>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("should switch tabs", () => {
    render(
      <Tabs>
        <div>Tab 1</div>
        <div>Tab 2</div>
      </Tabs>
    )
    fireEvent.click(screen.getByText("Tab 2"))
    expect(screen.getByText("Tab 2")).toHaveClass("active")
  })
})
