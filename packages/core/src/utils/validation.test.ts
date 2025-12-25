import { createFormSchema, validateComponent, validateForm } from "./validation"

describe("validation", () => {
  describe("createFormSchema", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      username: "john",
      age: 25,
      terms: true,
    }

    it("should validate correct data", () => {
      expect(validateForm(createFormSchema, validData)).toBe(true)
    })

    it("should invalidate incorrect email", () => {
      const data = { ...validData, email: "invalid" }
      expect(validateForm(createFormSchema, data)).toBe(false)
    })

    it("should invalidate short password", () => {
      const data = { ...validData, password: "123" }
      expect(validateForm(createFormSchema, data)).toBe(false)
    })

    it("should invalidate short username", () => {
      const data = { ...validData, username: "jo" }
      expect(validateForm(createFormSchema, data)).toBe(false)
    })

    it("should invalidate age below 18", () => {
      const data = { ...validData, age: 17 }
      expect(validateForm(createFormSchema, data)).toBe(false)
    })

    it("should invalidate unaccepted terms", () => {
      const data = { ...validData, terms: false }
      expect(validateForm(createFormSchema, data)).toBe(false)
    })
  })

  describe("validateComponent", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      username: "john",
      age: 25,
      terms: true,
    }

    it("should return success for valid data", () => {
      const result = validateComponent(createFormSchema, validData)
      expect(result.success).toBe(true)
      expect(result.parsedData).toEqual(validData)
      expect(result.errors).toBeNull()
    })

    it("should return errors for invalid data", () => {
      const invalidData = {
        email: "invalid",
        password: "123",
        username: "",
        age: 10,
        terms: false,
      }
      const result = validateComponent(createFormSchema, invalidData)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })
  })

  describe("validateForm", () => {
    const baseData = {
      email: "test@example.com",
      password: "password123",
      username: "john",
      age: 25,
      terms: true,
    }

    it("should return boolean for form validation", () => {
      expect(validateForm(createFormSchema, baseData)).toBe(true)
      expect(
        validateForm(createFormSchema, { ...baseData, email: "invalid" })
      ).toBe(false)
    })
  })
})
