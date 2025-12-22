import { renderHook } from "@testing-library/react"
import { useMediaQuery } from "./useMediaQuery"

describe("useMediaQuery", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it("returns true or false based on query", () => {
    // Меняем значение matches для теста
    ;(window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query.includes("max-width"),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"))
    expect(result.current).toBe(true)

    const { result: result2 } = renderHook(() => useMediaQuery("(min-width: 769px)"))
    expect(result2.current).toBe(false)
  })
})
