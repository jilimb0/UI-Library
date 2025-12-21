import { renderHook } from "@testing-library/react"
import { useMediaQuery } from "./useMediaQuery"

describe("useMediaQuery", () => {
  it("returns true or false based on query", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 600px)"))
    expect(typeof result.current).toBe("boolean")
  })
})
