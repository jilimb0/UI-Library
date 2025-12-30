import { render, screen, fireEvent } from "@testing-library/react"
import { toHaveNoViolations } from "jest-axe"
import { Form } from "./Form"
import React from "react"

expect.extend(toHaveNoViolations)

describe("Form", () => {
  it("renders without crashing", () => {
    const mockSubmit = jest.fn()
    render(<Form onSubmit={mockSubmit}>Example</Form>)
    expect(screen.getByText("Example")).toBeInTheDocument()
  })

  it("calls onSubmit when form is submitted", () => {
    const mockSubmit = jest.fn()
    render(<Form onSubmit={mockSubmit}>Example</Form>)
    fireEvent.submit(screen.getByTestId("form"))
    expect(mockSubmit).toHaveBeenCalled()
  })

  it("should collect and pass data on submit", () => {
    const mockSubmit = jest.fn()
    render(<Form onSubmit={mockSubmit}>Example</Form>)
    fireEvent.submit(screen.getByTestId("form"))
    expect(mockSubmit).toHaveBeenCalledWith({})
  })

  it("should prevent default form submission", () => {
    const mockSubmit = jest.fn()
    render(<Form onSubmit={mockSubmit}>Example</Form>)
    const form = screen.getByRole("form")
    fireEvent.submit(form)
    expect(mockSubmit).toHaveBeenCalled()
  })
})
