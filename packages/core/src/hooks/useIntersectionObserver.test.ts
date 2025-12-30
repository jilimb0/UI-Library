import { renderHook } from "@testing-library/react"
import { useIntersectionObserver } from "./useIntersectionObserver"

describe("useIntersectionObserver", () => {
  it("returns correct structure", () => {
    const { result } = renderHook(() => useIntersectionObserver())
    expect(result.current).toHaveProperty("targetRef")
    expect(result.current).toHaveProperty("isIntersecting")
    expect(typeof result.current.isIntersecting).toBe("boolean")
  })

  it("handles options correctly", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: 0.5 })
    )
    expect(result.current).toHaveProperty("targetRef")
    expect(typeof result.current.isIntersecting).toBe("boolean")
  })
})
