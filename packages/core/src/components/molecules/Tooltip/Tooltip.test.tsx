import { describe, it, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react"
import Tooltip from "./Tooltip"
import React from "react"
import "@testing-library/jest-dom"


describe("Tooltip", () => {
  it("renders without crashing", () => {
    render(<Tooltip content="Example">Example</Tooltip>)
    expect(
      screen.getByText("Example", { selector: "[data-tooltip-trigger]" })
    ).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Tooltip content="Example">Example</Tooltip>)
    const results = await axe(container)
  })
})
