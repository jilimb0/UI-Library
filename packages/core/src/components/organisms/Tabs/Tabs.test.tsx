import { render, screen, fireEvent } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"
import { Tabs } from "./Tabs"
import React, { ReactNode } from "react"

expect.extend(toHaveNoViolations)

const MockTab = ({
  children,
  selected = false,
  onSelect,
}: {
  children: ReactNode
  selected?: boolean
  onSelect?: () => void
}) => {
  return (
    <button className={selected ? "active" : ""} onClick={onSelect}>
      {children}
    </button>
  )
}

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

  it("should handle defaultIndex", () => {
    render(
      <Tabs defaultIndex={1}>
        <MockTab>Tab 1</MockTab>
        <MockTab>Tab 2</MockTab>
      </Tabs>
    )
    expect(screen.getByText("Tab 2")).toHaveClass("active")
  })

  it("should call onChange when tab is selected", () => {
    const onChange = jest.fn()
    render(
      <Tabs onChange={onChange}>
        <MockTab>Tab 1</MockTab>
        <MockTab>Tab 2</MockTab>
      </Tabs>
    )
    fireEvent.click(screen.getByText("Tab 2"))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
