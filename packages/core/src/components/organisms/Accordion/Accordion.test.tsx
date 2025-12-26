import { render, screen, fireEvent } from "@testing-library/react"
import { toHaveNoViolations } from "jest-axe"
import { Accordion } from "./Accordion"
import React from "react"
import "@testing-library/jest-dom"

expect.extend(toHaveNoViolations)

const MockAccordionItem = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className={isOpen ? "open" : ""}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </div>
  );
};

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

  it("should support multiple open items", () => {
    render(
      <Accordion multiple>
        <MockAccordionItem>Item 1</MockAccordionItem>
        <MockAccordionItem>Item 2</MockAccordionItem>
      </Accordion>
    )
    fireEvent.click(screen.getByText("Item 1"))
    fireEvent.click(screen.getByText("Item 2"))
    expect(screen.getByText("Item 1")).toHaveClass("open")
    expect(screen.getByText("Item 2")).toHaveClass("open")
  })
})
