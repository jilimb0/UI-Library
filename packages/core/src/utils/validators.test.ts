import { validateField, commonValidators } from "./validators"

describe("validators", () => {
  describe("validateField", () => {
    it("should validate required field", () => {
      const result = validateField("", { required: true })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("This field is required")
    })

    it("should validate minLength", () => {
      const result = validateField("ab", { minLength: 3 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Must be at least 3 characters")
    })

    it("should validate maxLength", () => {
      const result = validateField("abcd", { maxLength: 3 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Must be no more than 3 characters")
    })

    it("should validate pattern", () => {
      const result = validateField("abc", { pattern: /^[0-9]+$/ })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Invalid format")
    })

    it("should validate custom validator", () => {
      const result = validateField("abc", { custom: (v) => v.length > 3 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Invalid value")
    })

    it("should return valid result for correct values", () => {
      const result = validateField("abc", { minLength: 2, maxLength: 4 })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe("commonValidators", () => {
    it("should validate email", () => {
      const result = validateField("test@example.com", commonValidators.email)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      const resultInvalid = validateField("invalid", commonValidators.email)
      expect(resultInvalid.isValid).toBe(false)
      expect(resultInvalid.errors).toContain("Invalid format")
    })

    it("should validate phone", () => {
      const result = validateField("+1234567890", commonValidators.phone)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      const resultInvalid = validateField("123", commonValidators.phone)
      expect(resultInvalid.isValid).toBe(false)
      expect(resultInvalid.errors).toContain("Must be at least 10 characters")
    })

    it("should validate url", () => {
      const result = validateField("https://example.com", commonValidators.url)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      const resultInvalid = validateField("invalid", commonValidators.url)
      expect(resultInvalid.isValid).toBe(false)
      expect(resultInvalid.errors).toContain("Invalid format")
    })
  })
})
