import { render, screen, fireEvent } from "@testing-library/react"
import { toHaveNoViolations } from "jest-axe"
import { Accordion } from "./Accordion"
import "@testing-library/jest-dom"
import React, { ReactNode } from "react"

expect.extend(toHaveNoViolations)

const MockAccordionItem = ({
  children,
  isOpen = false,
  onToggle,
}: {
  children: ReactNode
  isOpen?: boolean
  onToggle?: () => void
}) => {
  return (
    <div className={isOpen ? "open" : ""} onClick={onToggle}>
      {children}
    </div>
  )
}

describe("Accordion", () => {
  it("should open and close items", () => {
    render(
      <Accordion>
        <MockAccordionItem>Item 1</MockAccordionItem>
        <MockAccordionItem>Item 2</MockAccordionItem>
      </Accordion>
    )
    fireEvent.click(screen.getByText("Item 1"))
    expect(screen.getByText("Item 1")).toHaveClass("open")
    fireEvent.click(screen.getByText("Item 1"))
    expect(screen.getByText("Item 1")).not.toHaveClass("open")
  })

  it("should close other items when multiple is not set", () => {
    render(
      <Accordion>
        <MockAccordionItem>Item 1</MockAccordionItem>
        <MockAccordionItem>Item 2</MockAccordionItem>
      </Accordion>
    )
    fireEvent.click(screen.getByText("Item 1"))
    fireEvent.click(screen.getByText("Item 2"))
    expect(screen.getByText("Item 1")).not.toHaveClass("open")
    expect(screen.getByText("Item 2")).toHaveClass("open")
  })

  it("should handle no items", () => {
    render(
      <Accordion>
        <div />
      </Accordion>
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("should support custom props like className", () => {
    render(
      <Accordion className="custom-class">
        <div />
      </Accordion>
    )
    expect(screen.getByTestId("accordion")).toHaveClass("custom-class")
  })
})
