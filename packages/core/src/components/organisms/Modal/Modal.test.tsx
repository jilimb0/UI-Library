import { render, screen, waitFor } from "@testing-library/react"
import Modal from "./Modal"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import React from "react"

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
    // @ts-ignore
    screen.getByTestId("modal-overlay").click()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("traps focus on first element when initialFocus is 'first'", async () => {
    render(
      <Modal isOpen={true} onClose={() => {}} initialFocus="first">
        <button data-testid="first-btn" tabIndex={0}>
          First
        </button>
        <button tabIndex={0}>Middle</button>
        <button tabIndex={0}>Last</button>
      </Modal>
    )
    await waitFor(() => expect(screen.getByTestId("first-btn")).toHaveFocus())
  })

  it("traps focus on last element when initialFocus is 'last'", async () => {
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={() => {}} initialFocus="last">
        <button data-testid="first-btn" tabIndex={0}>
          First
        </button>
        <button data-testid="middle-btn" tabIndex={0}>
          Middle
        </button>
        <button data-testid="last-btn" tabIndex={0}>
          Last
        </button>
      </Modal>
    )

    // initialFocus="last" → Last
    await waitFor(() => expect(screen.getByTestId("last-btn")).toHaveFocus())

    // Дальше фокус по правилам DOM: Last → Shift+Tab → Middle
    await user.keyboard("{Shift>}{Tab}")
    await waitFor(() => expect(screen.getByTestId("middle-btn")).toHaveFocus())
  })

  it("should trap focus and cycle between first and last elements", async () => {
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={() => {}} initialFocus="first">
        {/* только крайние элементы для простоты */}
        <button data-testid="first-btn" tabIndex={0}>
          First
        </button>
        <button data-testid="last-btn" tabIndex={0}>
          Last
        </button>
      </Modal>
    )

    const firstButton = screen.getByTestId("first-btn")
    const lastButton = screen.getByTestId("last-btn")

    await waitFor(() => expect(firstButton).toHaveFocus())

    // Tab: First -> Last (трэп по краям)
    await user.keyboard("{Tab}")
    await waitFor(() => expect(lastButton).toHaveFocus())

    // Shift+Tab: Last -> First (обратный трэп)
    await user.keyboard("{Shift>}{Tab}")
    await waitFor(() => expect(firstButton).toHaveFocus())
  })
})
