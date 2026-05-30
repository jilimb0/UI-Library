import { z } from 'zod';

// Form schema
export const createFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  age: z.number().min(18, 'Age must be at least 18'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type ValidationSuccess<T> = {
  success: true;
  parsedData: T;
  errors: null;
};

type ValidationFailure = {
  success: false;
  parsedData: null;
  errors: z.ZodIssue[];
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

// Generic validation helper
export const validateComponent = <T>(
  schema: z.ZodSchema<T>,
  data?: unknown
): ValidationResult<T> => {
  try {
    const parsedData = schema.parse(data);
    return { success: true, parsedData, errors: null };
  } catch (error) {
    return {
      success: false,
      parsedData: null,
      errors: (error as z.ZodError).errors,
    };
  }
};

// Form validation returns a simple boolean
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data?: unknown
): boolean => {
  const result = validateComponent(schema, data);
  return result.success;
};
