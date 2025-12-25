import { render, screen, fireEvent } from "@testing-library/react"
import { Modal } from "./Modal"
import React from "react"
import "@testing-library/jest-dom"

describe("Modal", () => {
  it("renders children content", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal content</div>
      </Modal>
    )
    expect(screen.getByText("Modal content")).toBeInTheDocument()
  })

  it("calls onClose when overlay clicked", () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    )
    fireEvent.click(screen.getByTestId("modal-overlay"))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("should trap focus", () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <button>First</button>
        <button>Last</button>
      </Modal>
    )
    expect(screen.getByText("First")).toHaveFocus()
    fireEvent.keyDown(document, { key: "Tab" })
    expect(screen.getByText("Last")).toHaveFocus()
  })
})
