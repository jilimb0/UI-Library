import { render, screen, fireEvent } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"
import { Tabs } from "./Tabs"
import React from "react"

expect.extend(toHaveNoViolations)

const MockTab = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = React.useState(false);
  return (
    <div
      className={selected ? "active" : ""}
      onClick={() => setSelected(true)}
    >
      {children}
    </div>
  );
};

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
        <MockTab>Tab 1</MockTab>
        <MockTab>Tab 2</MockTab>
      </Tabs>
    )
    fireEvent.click(screen.getByText("Tab 2"))
    expect(screen.getByText("Tab 2")).toHaveClass("active")
  })
})
