import { z } from "zod"

// Схема формы
export const createFormSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  age: z.number().min(18, "Age must be at least 18"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
})

// Универсальная функция валидации
export const validateComponent = <T>(schema: z.ZodSchema<T>, data?: any) => {
  try {
    const parsedData = schema.parse(data)
    return { success: true, parsedData, errors: null }
  } catch (error) {
    return {
      success: false,
      null: null,
      errors: (error as z.ZodError).errors,
    }
  }
}

// Валидация формы — просто boolean
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data?: any
): boolean => {
  const result = validateComponent(schema, data)
  return result.success
}
