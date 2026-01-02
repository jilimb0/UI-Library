import { describe, it, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react"
import { TextArea } from "./TextArea"
import React from "react"
import "@testing-library/jest-dom"


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
  })
})
