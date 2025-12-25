import { render, screen, fireEvent } from "@testing-library/react"
import { toHaveNoViolations } from "jest-axe"
import { Accordion } from "./Accordion"
import React from "react"
import "@testing-library/jest-dom"

expect.extend(toHaveNoViolations)

describe("Accordion", () => {
  it("should open and close items", () => {
    render(
      <Accordion>
        <div>Item 1</div>
        <div>Item 2</div>
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
        <div>Item 1</div>
        <div>Item 2</div>
      </Accordion>
    )
    fireEvent.click(screen.getByText("Item 1"))
    fireEvent.click(screen.getByText("Item 2"))
    expect(screen.getByText("Item 1")).toHaveClass("open")
    expect(screen.getByText("Item 2")).toHaveClass("open")
  })
})
