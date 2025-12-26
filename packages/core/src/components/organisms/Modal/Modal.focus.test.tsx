import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Modal } from "./Modal"
import React from "react"
import "@testing-library/jest-dom"

describe("Modal Focus Management", () => {
  it("traps focus on first element when initialFocus is 'first'", async () => {
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={() => {}} initialFocus="first">
        <button tabIndex={0}>First</button>
        <button tabIndex={0}>Last</button>
      </Modal>
    )

    expect(screen.getByText("First")).toHaveFocus()

    await user.keyboard("{Shift>}{Tab}")
    expect(screen.getByText("Last")).toHaveFocus()
  })

  it("traps focus on last element when initialFocus is 'last'", async () => {
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={() => {}} initialFocus="last">
        <button tabIndex={0}>First</button>
        <button tabIndex={0}>Last</button>
      </Modal>
    )

    expect(screen.getByText("Last")).toHaveFocus()

    await user.keyboard("{Shift>}{Tab}")
    expect(screen.getByText("First")).toHaveFocus()
  })
})
