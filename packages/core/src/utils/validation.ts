
import { z } from 'zod';

export const createFormSchema = {
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // ... other common validations
};

export const validateComponent = (schema: z.ZodSchema, data: unknown) => {
  try {
    return { success: true, data: schema.parse(data), errors: null };
  } catch (error) {
    return { success: false, data: null, errors: error.errors };
  }
};
